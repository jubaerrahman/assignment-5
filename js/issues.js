const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues"

const container = document.getElementById("issuesContainer")
const loader = document.getElementById("loader")

function showLoader(){
 loader.classList.remove("hidden")
}

function hideLoader(){
 loader.classList.add("hidden")
}


function setActiveTab(id){

let tabs = document.querySelectorAll(".tab")

tabs.forEach(t=>{
 t.classList.remove("tab-active")
})

document.getElementById(id).classList.add("tab-active")

}



function loadIssues(){

setActiveTab("allTab")

showLoader()

fetch(API)
.then(res => res.json())
.then(data => {

let issues = data.data

renderIssues(issues)

hideLoader()

})

}



function loadOpen(){

setActiveTab("openTab")

showLoader()

fetch(API)
.then(res => res.json())
.then(data => {

let issues = data.data

let openIssues = issues.filter(function(i){
 return i.status.toLowerCase() === "open"
})

renderIssues(openIssues)

hideLoader()

})

}



function loadClosed(){

setActiveTab("closedTab")

showLoader()

fetch(API)
.then(res => res.json())
.then(data => {

let issues = data.data

let closed = []

issues.forEach(i=>{
 if(i.status.toLowerCase() === "closed"){
  closed.push(i)
 }
})

renderIssues(closed)

hideLoader()

})

}



function renderIssues(issues){

container.innerHTML = ""

document.getElementById("issueCount").innerText =
issues.length + " Issues"


issues.forEach(issue => {

let status = issue.status.toLowerCase()

let border = "border-purple-500"

if(status === "open"){
 border = "border-green-500"
}


let priorityColor = "badge-info"

if(issue.priority === "HIGH"){
 priorityColor = "badge-error"
}
else if(issue.priority === "MEDIUM"){
 priorityColor = "badge-warning"
}


let labels = ""

if(issue.labels){

 issue.labels.forEach(label=>{
  labels += `<span class="badge badge-outline">${label.toUpperCase()}</span>`
 })

}


let createdDate =
new Date(issue.createdAt).toLocaleDateString()

let updatedDate =
new Date(issue.updatedAt || issue.createdAt).toLocaleDateString()



let card = document.createElement("div")

card.className =
"bg-white rounded-xl shadow border-t-4 "+border+" cursor-pointer"

card.innerHTML = `

<div class="p-5">

<div class="flex justify-between items-center mb-3">

<div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
•
</div>

<span class="badge ${priorityColor}">
${issue.priority}
</span>

</div>

<h2 class="font-bold text-lg mb-2">
${issue.title}
</h2>

<p class="text-gray-500 text-sm mb-4">
${issue.description}
</p>

<div class="flex gap-2 mb-4">
${labels}
</div>

</div>

<div class="border-t px-5 py-3 text-sm text-gray-500">

<p>#${issue.id} by ${issue.author}</p>

<p>Created: ${createdDate}</p>

<p>Updated: ${updatedDate}</p>

</div>

`

card.onclick = function(){
 openIssue(issue.id)
}

container.appendChild(card)

})

}



function openIssue(id){

fetch("https://phi-lab-server.vercel.app/api/v1/lab/issue/"+id)
.then(res => res.json())
.then(data => {

let issue = data.data

let date =
new Date(issue.createdAt).toLocaleDateString()

document.getElementById("modalTitle").innerText =
issue.title

document.getElementById("modalAuthor").innerText =
"Opened by "+issue.author

document.getElementById("modalDate").innerText =
date

document.getElementById("modalDesc").innerText =
issue.description

document.getElementById("modalAssignee").innerText =
issue.author



let p = document.getElementById("modalPriority")

p.innerText = issue.priority

if(issue.priority === "HIGH"){
 p.className = "badge badge-error"
}
else if(issue.priority === "MEDIUM"){
 p.className = "badge badge-warning"
}
else{
 p.className = "badge badge-info"
}



let labelBox = document.getElementById("modalLabels")

labelBox.innerHTML = ""

if(issue.labels){

 issue.labels.forEach(l=>{
  labelBox.innerHTML +=
  `<span class="badge badge-outline">${l.toUpperCase()}</span>`
 })

}

document.getElementById("issueModal").checked = true

})

}


function searchIssues(){

let text =
document.getElementById("searchInput").value.trim()

if(text === ""){
 loadIssues()
 return
}

showLoader()

fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q="+text)
.then(res => res.json())
.then(data => {

renderIssues(data.data)

hideLoader()

})

}



document.getElementById("searchInput")
.addEventListener("keypress",function(e){

 if(e.key === "Enter"){
  searchIssues()
 }

})



loadIssues()