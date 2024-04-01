app.post('/api/extract', upload.single('file'), async (req, res) => {
    logInfo('POST /api/extract',req.body);
    logInfo('FILE=',req.file);

    //# Overall the code is very deeply nested which makes it less readable.
    //# One could refactor the error handling the following way:
    //#
    //# if (!req.body)
    //#    res.status(400).json({requestID: '', message: 'Missing requried input: (form data)'});
    //#
    //# const { requestID, project, idUser } = req.body;
    //# const user = await User.findOne(idUser);
    //#
    //# if(missingFields)
    //#     return res.status(400).json({requestID, message: `Missing requried input: ${missingFields}`});
    //# ...rest of application logic...
    if (req.body) {
        const file = req.file;
        const requestID = req.body.requestID;
        const project = req.body.project;
        const idUser = req.body.userID;
        //# ensure that project, idUser and all other user-provided data is validated 
        //# before they are used as input for database operations (unless the db functions sanitize and validate input)
        
        const user = await User.findOne(idUser);

        if (requestID && project && idUser && user) {
            logDebug('User with role '+user.role, user);
            //# code would be cleaner if the boolean expression was refactored to a separate function:
            //# if (isAdvisor(user)) {...}
            if (user.role === 'ADVISOR' || user.role.indexOf('ADVISOR') > -1)
                return res.json({requestID, step: 999, status: 'DONE', message: 'Nothing to do for ADVISOR role'});

            //# Comments don't tell the truth as code changes.
            //# It would thus be better to express the desired intent as a function name and implement it accordingly:
            //# await resetStatusVars(requestID)   
            /* reset status variables */
            await db.updateStatus(requestID, 1, '');

            logDebug('CONFIG:', config.projects);
            //# same as above, it would be more readable to refactor the conditional to a separate function:
            //# if (isInkassor(project, file)) 
            //#     handleInkassor(file, req, project, ...)
            if (project === 'inkasso' && config.projects.hasOwnProperty(project) && file) {
                const hashSum = crypto.createHash('sha256');
                //# hashSum is an unused variable, best to remove
                const fileHash = idUser;
                //# fileHash store a user ID, this should be renamed
                const fileName = 'fullmakt';
                //# The default file name ('fullmakt') can be a constant and it could be more expressive.
                const fileType = mime.getExtension(file.mimetype);
                if (fileType !== 'pdf')
                    return res.status(500).json({requestID, message: 'Missing pdf file'});
                    //# return 400 Bad Request to inform the user that something is wrong with their reqeust
                await db.updateStatus(requestID, 3, '');
                //# db.updateStatus is repeated mulitple times.
                //# it would be advisable to encapsualte this functionality in a separate function and to automatically
                //# update the count if this is the desired behaviour

                //# behaviour related to the pdf file extraction can be put into a separate function to make
                //# the code more readable

                const folder = `${project}-signed/${idUser}`;
                logDebug('FILE2=', file);
                //# log can be more expressive, FILE2 does not indicate the intended use of the file
                await uploadToGCSExact(folder, fileHash, fileName, fileType, file.mimetype, file.buffer);
                //# it would be desirable to handle any potential errors for uploadToGCSExact and to include them in the debug logs
                await db.updateStatus(requestID, 4, '');
                // # db.updateStatus: see above
                const ret = await db.updateUploadedDocs(idUser, requestID, fileName, fileType, file.buffer);
                //# ret is a bad variable name, something like updateUploadedDocsResult would be more descriptive

                logDebug('DB UPLOAD:', ret);
                //# it would be desirable to log the context too, e.g. idUser, requestID, fileName ...
                
                //# db operation could be extracted to wrapper functions which handle error and debug logging under the hood

                await db.updateStatus(requestID, 5, '');
                // # db.updateStatus: see above


                let sent = true;
                //# unused variable
                const debtCollectors = await db.getDebtCollectors();
                logDebug('debtCollectors=', debtCollectors);
                //# log context, otherwise it will be quite time consuming to debug
                if (!debtCollectors)
                    return res.status(500).json({requestID, message: 'Failed to get debt collectors'});

                //# The 'FIX' comment should be a TODO because FIX does not tell if this feature is already done or not.
                //# While this view is opinionated, I believe that TODO's and comments should not be kept in code because they
                //# are often overlooked. It would be better to either implement the age check or to keep this information
                //# in the project planning software 
                if (!!(await db.hasUserRequestKey(idUser))) { //FIX: check age, not only if there's a request or not
                    return res.json({requestID, step: 999, status: 'DONE', message: 'Emails already sent'});
                    //# Question to developer: Why is step 999? Iff this is really necessary, wrap this inside a
                    //# variable with a descriptive name, e.g. {..., step: FORCE_FOO_WORKAROUND, ...}
                }

                const sentStatus = {};
                for (let i = 0; i < debtCollectors.length ; i++) {
                    //# it would be more readable to extract the for loop in a separate function.
                    //# or, even better to iterate over the debtCollectors:
                    //# debtCollectors.map((debtCollector) => doSomethingWithDebtCollector(debtCollector))
                    //# Obviously, the doSomethingWithdebtCollector should be renamed to something that more accurately represents the intent
                    await db.updateStatus(requestID, 10+i, '');
                    const idCollector = debtCollectors[i].id;
                    const collectorName = debtCollectors[i].name;
                    const collectorEmail = debtCollectors[i].email;
                    //# const { idCollect, collectorName, collectorEmail } = debtColloctor (or debtCollectors[i], depending on the approach used)
                    const hashSum = crypto.createHash('sha256');
                    const hashInput = `${idUser}-${idCollector}-${(new Date()).toISOString()}`;
                    logDebug('hashInput=', hashInput);
                    hashSum.update(hashInput);
                    const requestKey = hashSum.digest('hex');
                    logDebug('REQUEST KEY:', requestKey);

                    const hash = Buffer.from(`${idUser}__${idCollector}`, 'utf8').toString('base64')

                    if (!!(await db.setUserRequestKey(requestKey, idUser))
                        && !!(await db.setUserCollectorRequestKey(requestKey, idUser, idCollector))) {

                        /* prepare email */
                        const sendConfig = {
                            //# Configuration values are directly accessed. 
                            //# Proper error handling should be done if config values are not present
                            sender: config.projects[project].email.sender,
                            replyTo: config.projects[project].email.replyTo,
                            subject: 'Email subject',
                            templateId: config.projects[project].email.template.collector,
                            params: {
                                //# Extract url to constant or function:
                                //# const downloadUrl = (requestKey, hash) => `BASE_URL?requestKey=${requestKey}&hash=${hash}`
                                //# (or use use the function string.replace())
                                //# downloadUrl: downloadUrl(requestKey, hash)
                                downloadUrl: `https://url.go/download?requestKey=${requestKey}&hash=${hash}`,
                                uploadUrl: `https://url.go/upload?requestKey=${requestKey}&hash=${hash}`,
                                confirmUrl: `https://url.go/confirm?requestKey=${requestKey}&hash=${hash}`
                            },
                            tags: ['request'],
                            to: [{ email: collectorEmail , name: collectorName }],
                        };
                        logDebug('Send config:', sendConfig);

                        try {
                            await db.setEmailLog({collectorEmail, idCollector, idUser, requestKey})
                        } catch (e) {
                            logDebug('extract() setEmailLog error=', e);
                        }

                        //# this comment is unnecessary as email.send already shows the intent
                        /* send email */
                        //# resp needs a more descriptive name, like summaryMailSendResult
                        const resp = await email.send(sendConfig, config.projects[project].email.apiKey);
                        logDebug('extract() resp=', resp);

                        // update DB with result
                        //# error handling and logging could be done
                        await db.setUserCollectorRequestKeyRes(requestKey, idUser, idCollector, resp);

                        if (!sentStatus[collectorName])
                            sentStatus[collectorName] = {};
                        sentStatus[collectorName][collectorEmail] = resp;

                        //# This check should be done before the line above
                        if (!resp) {
                            logError('extract() Sending email failed: ', resp);
                            //# log needs more context for more effective debugging
                        }
                    }
                }
                await db.updateStatus(requestID, 100, '');

                logDebug('FINAL SENT STATUS:');
                console.dir(sentStatus, {depth: null});
                //# should use logDebug. Moreover, FINAL SENT STATUS with ALL_CAPS 
                //# is inconsistent with other debug messages

                //# unused code, should be removed
                //if (!allSent)
                //return res.status(500).json({requestID, message: 'Failed sending email'});

                await db.updateStatus(requestID, 500, '');

                //# summaryConfig is duplicated. Would be better to create a function
                //# prepareEmail(...) and is it here and in the place above
                /* prepare summary email */
                const summaryConfig = {
                    //bcc: [{ email: 'unknown@domain.com', name: 'Tomas' }],
                    sender: config.projects[project].email.sender,
                    replyTo: config.projects[project].email.replyTo,
                    subject: 'Oppsummering Kravsforespørsel',
                    templateId: config.projects[project].email.template.summary,
                    params: {
                        collectors: sentStatus,
                    },
                    tags: ['summary'],
                    to: [{ email: 'unknown@otherdomain.no' , name: 'Tomas' }], // FIXXX: config.projects[project].email.sender
                };
                logDebug('Summary config:', summaryConfig);

                /* send email */
                //# Remove unneeded code
                //const respSummary = await email.send(sendConfig, config.projects[project].email.apiKey);
                //logDebug('extract() summary resp=', respSummary);
                await db.updateStatus(requestID, 900, '');
            }
            await db.updateStatus(requestID, 999, '');
            return res.json({requestID, step: 999, status: 'DONE', message: 'Done sending emails...'});
        } else
            return res.status(500).json({requestID, message: 'Missing requried input (requestID, project, file)'});
            //# 400 Bad Request would be more suitable
            //# 
    }
    res.status(500).json({requestID: '', message: 'Missing requried input (form data)'});
    //# 400 Bad Request would be more suitable

});