  var carrers=[];
  function addCarrers(){
    carrers.push(document.getElementById("carrertitle").value);
    var x=`<h3 class="`+document.getElementById("carrertitle").value+`"> <span class="badge badge-secondary">`+document.getElementById("carrertitle").value+`</span><i class="fa fa-times" id="`+document.getElementById("carrertitle").value+`" aria-hidden="true" onclick="delCarrer(this.id)"></i></h3>`;
    // var x=`<span type="button" class="btn btn-primary">
    //   `+document.getElementById("carrertitle").value+`<span class="badge badge-light"><i class="fa fa-times" id="document.getElementById("carrertitle").value" aria-hidden="true" onclick="delCarrer(this.id)"></i></span>
    // </button>`;
    document.getElementById('carrersName').innerHTML+=x;
    document.getElementById("carrertitle").value="";
    console.log(carrers);
    // for(var i=0;i<carrers.length;i++){
    // }
  }

  // delete member
  function deleteMember(name){
    // alert(name);
    document.getElementById('deleteMember').innerHTML=name;
    $('#memberModal').modal('show');
  }
  var delMember;
  $('#delMem_modal').on('show.bs.modal', function(e) {
    delMember = $(e.relatedTarget).data('book-id');
    // alert(bookId);
    // console.log(bookId);
    // $(e.currentTarget).find('#delete').innerText=bookId;
    document.getElementById('delete').innerText=delMember;
});
function get_action_forMember(form) {
        // alert(bookId)
        form.action = '/removeMember/'+delMember;
  }
// end of delete member

// delete article
var delArticle;
$('#delArticle_modal').on('show.bs.modal', function(e) {
  delArticle = $(e.relatedTarget).data('book-id');
    // alert(bookId);
    // console.log(bookId);
    // $(e.currentTarget).find('#delete').innerText=bookId;
    document.getElementById('deleteArticle').innerText=delArticle;
});

  function get_action_forArticle(form) {
        // alert(bookId)
        form.action = '/removeArticle/'+delArticle;
  }
  // end of delete article
  
  // delete career
  var delCareer;
$('#delCareer_modal').on('show.bs.modal', function(e) {
  delCareer = $(e.relatedTarget).data('book-id');
    // alert(bookId);
    // console.log(bookId);
    // $(e.currentTarget).find('#delete').innerText=bookId;
    document.getElementById('deleteCareer').innerText=delCareer;
});
function get_action_forCareer(form) {
        // alert(bookId)
        form.action = '/removeCarrer/'+delCareer;
  }
  // end of delete article

  $(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();   
});


var wantedMem;
var wantedArticle;
var selected;
var wantedCareer;
// openMember
function openMember(memname){
    // var name=memname;
    fetch('http://localhost:3000/fetch/team') // Call the fetch function passing the url of the API as a parameter
    .then((resp) => resp.json())
    .then(function(data) {
        // Your code for handling the data you get from the API
        // console.log(data);
        // console.log(memname)
        for(var i=0;i<data.length;i++){
            if(data[i].Name==memname){
                wantedMem=data[i];
            }
        }
        // console.log(wantedMem)
        var x=`<div class="row" style="overflow-y:auto;">
        <div class="col-lg-1"></div>
        <div class="col-lg-10">
        <h5>`+wantedMem.Name+`</h5> 
                <p style="color: rgba(128, 128, 128, 0.671);">`+wantedMem.Position+`</p>
                <p style="color: #2c2b2b;" class="memInfo">
                <img src="`+wantedMem.Image+`" alt="Card image" style="float:right;width:10vw;heght:auto;border-radius:100%;">
                `+wantedMem.About+`                                                
                </p>   
        </div>
        <div class="col-lg-1"></div>
    </div>`;
        // About, Name, Image, Position
        selected="member";
        document.getElementById('showSection').innerHTML=x;
    })
    .catch(function(err) {
        console.log(err);
        // This is where you run code if the server returns any errors
    });
}
// end of openMember
//openArticle
// function openArticle(){}
// end of openArticle
// openCareer
// end of oepn
function editMember(){
    var x=`<div class="form-group">
    <form action="/editmember/`+wantedMem.Name+`" method="POST">
      <div class="form-group">
        <label for="memName">Name:</label>
        <input type="text" class="form-control" placeholder="Enter name" id="memName" name="memName" value="`+wantedMem.Name+`">
      </div>
      <div class="form-group">
        <label for="memPosition">Position:</label>
        <input type="text" class="form-control" placeholder="Enter position" id="memPosition" name="memPosition" value="`+wantedMem.Position+`">
      </div>
      <div class="form-group">
        <label for="memInfo">About:</label>
        <input type="text" class="form-control" placeholder="Enter information" id="memInfo" name="memInfo" value="`+wantedMem.About+`">
      </div>
      <div class="form-group">
        <label for="memImg">Image:</label>
        <input type="text" class="form-control" placeholder="Enter imagename" id="memImg" name="memImg" value="`+wantedMem.Image+`">
      </div>
      <button type="submit" class="btn" style="background: rgba(74, 230, 230, 0.849);">Edit Member</button>
    </form>                
</div>`;
document.getElementById('showSection').innerHTML=x;
}

function performEdit(){
    if(selected=="member"){
        editMember();
    }else if(selected=="article"){
        editArticle();
    }else if(selected=="career"){
        editCareer();
    }
}