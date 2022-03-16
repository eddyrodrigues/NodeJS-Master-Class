const btn_login = document.getElementById('btn_login');
const btn_logout = document.getElementById('btn_logout');
const btn_profile = document.getElementById('btn_profile');


if (typeof(btn_login) != 'undefined' && btn_login != null ){
  btn_login.addEventListener("click", (e) => {
    e.preventDefault();
    const req_opt = {
      'Method' : 'post',
      'Content-Type': 'application/json',
    };
    
    console.log(document.getElementsByName('username'));

    const guid     = document.getElementById('yourUsername').value;
    const password = document.getElementById('yourPassword').value;

    req_obj = {
      guid,
      password
    }  

    var req = { method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                  },
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify(req_obj)
                };
    
    console.log(JSON.stringify(req_obj), req);

    fetch('http://localhost:3000/api/tokens', req)
    .then((res) => {
      if (res.status == 200){
        res.json().then((data) => {
          console.log(data);
          const { id } = data;
          localStorage.setItem('token', id);
          alert('The user logged successfully, token id: ' + id);
          window.location.assign(`/?token=${id}`);
        })
      } else {
      res.json().then((data) => {
        const { message } =  data;
        alert(message);
      });
      }
    });

    // xhttp.open('POST', 'http://localhost:3000/api/tokens', false);
    // xhttp.setRequestHeader("Content-type", "application/json");
    // xhttp.send(JSON.stringify(req_obj));


  });
}

if (typeof(btn_logout) != 'undefined' && btn_logout != null){ 
  btn_logout.addEventListener('click', (e) => {
    e.preventDefault();
    const req_opt = {
      'Method' : 'post',
      'Content-Type': 'application/json',
    };
    
    const token = localStorage.getItem('token'); 
    req_obj = {
      'id':token
    }  

    var req = { method: 'DELETE',
                headers: {
                    'Content-Type':'application/json',
                  },
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify(req_obj)
                };
    
    console.log(JSON.stringify(req_obj), req);

    fetch('http://localhost:3000/api/tokens', req)
    .then((res) => {
      if (res.status == 200){        
          alert('Você será redirecionado em instantes, deslogando...');
          localStorage.removeItem('token');
          window.location.assign('/login');
      } else {
      res.json().then((data) => {
        const { message } =  data;
        alert('Erro ao deslogar: ', message);
      });
      }
    });
  });
}

if (typeof(btn_profile) != 'undefined' && btn_profile != null){ 
  btn_profile.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.assign(`http://localhost:3000/my-profile?token=${localStorage.getItem('token')}`);
  });
}
