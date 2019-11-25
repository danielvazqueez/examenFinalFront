var token = localStorage.getItem('token');
if (token) {
  token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token start/end.
}


var todos = document.querySelectorAll("input[type=checkbox]");

$('#logout').on('click', function(){
  localStorage.removeItem('token');
  window.location = './index.html'
});



function loadTodos() {
  // empty list first
  $('#todo-list').empty()
  $.ajax({
    url: 'https://todos-examen.herokuapp.com/todos',
    headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + token
    },
    method: 'GET',
    dataType: 'json',
    success: function(data){

      for( let i = 0; i < data.length; i++) {
        // aqui va su código para agregar los elementos de la lista
        addTodo(data[i]._id, data[i].description, data[i].completed, "input"+i)
        $('#input' + i).on('click', function(event){
          json_to_send = {
            "completed" : this.checked
          };
          json_to_send = JSON.stringify(json_to_send);
          id = data[i]._id
          $.ajax({
            url: `https://todos-examen.herokuapp.com/todos/${id}`,
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + token
            },
            method: 'PATCH',
            dataType: 'json',
            data: json_to_send,
            error: function(error_msg) {
              alert((error_msg['responseText']));
            }
          });
        });
      }
    },
    error: function(error_msg) {
      alert((error_msg['responseText']));
    }
  });
}


// o con jquery
// $('input[name=newitem]').keypress(function(event){
//     var keycode = (event.keyCode ? event.keyCode : event.which);
//     if(keycode == '13'){
//         $.ajax({})
//     }
// });

var input = document.querySelector("input[name=newitem]");

input.addEventListener('keypress', function (event) {
  if (event.charCode === 13) {
    json_to_send = {
      "description" : input.value
    };
    json_to_send = JSON.stringify(json_to_send);
    $.ajax({
      url: 'https://todos-examen.herokuapp.com/todos',
      headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
      },
      method: 'POST',
      dataType: 'json',
      data: json_to_send,
      success: function(data){
        // agregar código aqui para poner los datos del todolist en el el html
        loadTodos()
      },
      error: function(error_msg) {
        alert((error_msg['responseText']));
      }
    });
    input.value = '';
  }
})

loadTodos();

function addTodo(id, todoText, completed, index) {
  $('#todo-list').append(`<li><input id="${index}"class="inputTodo" type="checkbox" name="todo" ${completed ? "checked" : ""}><span>${todoText}</span></li>`)
}