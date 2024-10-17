class Log {

    info = text => {        
        console.info(`[${getData()}]`, "[INFO]", text);
    }
    warning = text => {        
        console.info(`[${getData()}]`, "[WARN]", text);
    }
    error = text => {        
        console.info(`[${getData()}]`, "[ERROR]", text);
    }
    server = text => {        
        console.info(`[${getData()}]`, "[SERVR]", text);
    }
    // warning
    // error
    // fatal
    // server
    // runner
    //test
}

function getData() {
    const date = new Date();
    return date.toLocaleString('en-US', { timeZoneName: 'short' });
}

const log = new Log();
export default log;
