// Dark Mode Toggle
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerHTML="☀️ Light Mode";
    }
    else{
        themeBtn.innerHTML="🌙 Dark Mode";
    }
});

// Skill Database
const skills = [
"java",
"python",
"c",
"c++",
"html",
"css",
"javascript",
"react",
"node",
"express",
"mongodb",
"sql",
"mysql",
"github",
"git",
"machine learning",
"ai",
"data structures",
"algorithms",
"problem solving",
"communication",
"leadership"
];

// Analyze Button
document.getElementById("analyzeBtn").addEventListener("click", analyzeResume);

function analyzeResume(){

const text=document.getElementById("resumeText").value.toLowerCase();

if(text==""){
alert("Please paste your resume or upload PDF.");
return;
}

let detected=[];
let missing=[];

skills.forEach(skill=>{

if(text.includes(skill))
detected.push(skill);

else
missing.push(skill);

});

let score=detected.length*5;

if(text.length>1000)
score+=10;

if(text.includes("project"))
score+=5;

if(text.includes("intern"))
score+=5;

if(text.includes("certificate"))
score+=5;

if(score>100)
score=100;

// Animate Score

let current=0;

const interval=setInterval(()=>{

current++;

document.getElementById("score").innerHTML=current;

if(current>=score)
clearInterval(interval);

},20);

document.getElementById("skills").innerHTML=
detected.length?detected.join(", "):"No skills detected";

document.getElementById("missing").innerHTML=
missing.slice(0,10).join(", ");

const tips=document.getElementById("tips");

tips.innerHTML="";

let suggestions=[];

if(score<40){

suggestions.push("Add technical skills.");

suggestions.push("Mention projects.");

suggestions.push("Include internships.");

suggestions.push("Add certifications.");

}

else if(score<70){

suggestions.push("Add achievements.");

suggestions.push("Improve formatting.");

suggestions.push("Mention leadership roles.");

}

else{

suggestions.push("Excellent Resume!");

suggestions.push("Tailor resume for each job.");

suggestions.push("Keep learning new skills.");

}

suggestions.forEach(item=>{

const li=document.createElement("li");

li.innerHTML=item;

tips.appendChild(li);

});

}

// PDF Upload

document.getElementById("pdfFile").addEventListener("change",function(){

const file=this.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(){

const typedarray=new Uint8Array(reader.result);

pdfjsLib.getDocument(typedarray).promise.then(function(pdf){

let pages=[];

for(let i=1;i<=pdf.numPages;i++){

pages.push(

pdf.getPage(i).then(function(page){

return page.getTextContent().then(function(text){

return text.items.map(s=>s.str).join(" ");

});

})

);

}

Promise.all(pages).then(function(content){

document.getElementById("resumeText").value=

content.join(" ");

});

});

}

reader.readAsArrayBuffer(file);

});

// Download PDF Report

document.getElementById("downloadBtn").addEventListener("click",()=>{

const {jsPDF}=window.jspdf;

const doc=new jsPDF();

doc.setFontSize(18);

doc.text("AI Resume Analysis Report",20,20);

doc.setFontSize(14);

doc.text(
"Resume Score : "+document.getElementById("score").innerText,
20,
40
);

doc.text(
"Detected Skills:",
20,
60
);

doc.text(
document.getElementById("skills").innerText,
20,
70
);

doc.text(
"Missing Skills:",
20,
95
);

doc.text(
document.getElementById("missing").innerText,
20,
105
);

doc.text(
"Suggestions:",
20,
130
);

const items=document.querySelectorAll("#tips li");

let y=140;

items.forEach(i=>{

doc.text("- "+i.innerText,20,y);

y+=10;

});

doc.save("Resume_Report.pdf");

});