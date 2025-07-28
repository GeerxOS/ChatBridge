function logging(message){
    const date = new Date;
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    let fMessage = `[${h}:${m}:${s}] ${message}`;

    console.log(fMessage);
}

module.exports = logging;