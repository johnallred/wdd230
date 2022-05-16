const now = new Date();
const fulldateUK = new Intl.DateTimeFormat("en-UK", {
    dateStyle: "full"
}).format(now);
document.querySelector("#uk_date").innerHTML = fulldateUK;