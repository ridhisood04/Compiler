let lineNumber = 1, height, delim;
window.addEventListener("keypress", (e) => {
    if(e.key === "Enter") {
        const a = document.getElementById("line-counter");
        const b = document.createElement("p");
        b.innerText = ++lineNumber;
        a.appendChild(b);
        delim = document.getElementById("code-container").offsetHeight - height;
        height = document.getElementById("code-container").offsetHeight;
    }
});

window.addEventListener("keyup", (e) => { 
    if(e.key === "Backspace") {
        if(document.getElementById("code-container").offsetHeight === height) {
            document.getElementById("line-counter").lastChild.remove();
            height -= delim;
            lineNumber--;
        }
    }
});

document.getElementById("editor").addEventListener("click", () => {
    document.getElementById("code-container").focus();
})


document.getElementById("submit").addEventListener("click", () => {
    const request = new XMLHttpRequest();
    const code = document.getElementById("code-container").innerText;
    const id = document.getElementById("language").value;
    
    //making post request
    request.open("POST"," https://codequotient.com/api/executeCode");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify({ "code" : code , langId : id}));

    request.addEventListener("readystatechange", () => {
        if(request.readyState == 4) {
            const codeId = JSON.parse(request.responseText).codeId;

            //making get request to get result
            const getAns = setInterval(() => {
                const xhttp = new XMLHttpRequest();
                xhttp.open("GET", "https://codequotient.com/api/codeResult/" + codeId);
                xhttp.send();
                xhttp.addEventListener("readystatechange", () => {
                    if(xhttp.readyState == 4) {
                        const data = JSON.parse(JSON.parse(xhttp.responseText).data);
                        if('output' in data) {
                            const output = data.output.replace(/\n/g,' ');
                            if(output !== '') {
                                const result = document.getElementById("result");
                                result.innerText = output;
                            }
                            else {
                                const errors = data.errors.replace(/\n/g,' ');
                                const result = document.getElementById("result");
                                result.innerText = errors;
                            }
                            clearInterval(getAns);
                        }
                    }
                });
            }, 1000);
        }
    });
});