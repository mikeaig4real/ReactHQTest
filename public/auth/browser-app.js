const logformDOM = document.querySelector('.form.login')
const regformDOM = document.querySelector('.form.register')
const logusernameInputDOM = document.querySelector('.login .username-input')
const regusernameInputDOM = document.querySelector('.register .username-input')
const logpasswordInputDOM = document.querySelector('.login .password-input')
const regpasswordInputDOM = document.querySelector('.register .password-input')
const logformAlertDOM = document.querySelector('.login .form-alert')
const regformAlertDOM = document.querySelector('.register .form-alert')
const resultDOM = document.querySelector('.result')
const btnDOM = document.querySelector('#data')
const tokenDOM = document.querySelector('.token')


logformDOM.addEventListener('submit', async (e) => {
  logformAlertDOM.classList.remove('text-success')
  tokenDOM.classList.remove('text-success')

  e.preventDefault()
  const username = logusernameInputDOM.value
  const password = logpasswordInputDOM.value

  try {
    const {
      data
    } = await axios.post('/api/v1/auth/login',{username,password})

    logformAlertDOM.style.display = 'block'
    logformAlertDOM.textContent = data.msg

    if (data.token) {
      let user = {
        username,
        token: data.token
      };
      localStorage.setItem('user', JSON.stringify(user));
    }
    logformAlertDOM.classList.add('text-success')
    logusernameInputDOM.value = ''
    logpasswordInputDOM.value = ''
    resultDOM.innerHTML = ''
    tokenDOM.textContent = 'token present'
    tokenDOM.classList.add('text-success')
    window.location.href = '/api/v1/dashboard';
  } catch (error) {
    logformAlertDOM.style.display = 'block'
    logformAlertDOM.textContent = error.response.data.msg
    localStorage.removeItem('token')
    resultDOM.innerHTML = ''
    tokenDOM.textContent = 'no token present'
    tokenDOM.classList.remove('text-success')
  }
  setTimeout(() => {
    logformAlertDOM.style.display = 'none'
  }, 2000)
})

regformDOM.addEventListener('submit', async (e) => {
  regformAlertDOM.classList.remove('text-success')
  tokenDOM.classList.remove('text-success')

  e.preventDefault()
  const username = regusernameInputDOM.value
  const password = regpasswordInputDOM.value

  try {
    const {
      data
    } = await axios.post('/api/v1/auth/register', {
      username,
      password
    })

    regformAlertDOM.style.display = 'block'
    regformAlertDOM.textContent = data.msg

    regformAlertDOM.classList.add('text-success')
    regusernameInputDOM.value = ''
    regpasswordInputDOM.value = ''

    let user = { username, token:data.token };
    localStorage.setItem('user', JSON.stringify(user));

    resultDOM.innerHTML = '';
    tokenDOM.textContent = 'token present'
    tokenDOM.classList.add('text-success')
  } catch (error) {
    regformAlertDOM.style.display = 'block'
    regformAlertDOM.textContent = error.response.data.msg
    localStorage.removeItem('token')
    resultDOM.innerHTML = ''
    tokenDOM.textContent = 'no token present'
    tokenDOM.classList.remove('text-success')
  }
  setTimeout(() => {
    regformAlertDOM.style.display = 'none'
  }, 2000)
})

btnDOM.addEventListener('click', async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  let token;
  if (user) {
    token = user.token
  }
  try {
    const { data } = await axios.get('/api/v1/tasks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    resultDOM.innerHTML = `<h5>Welcome ,${user.username}</h5><p>Your special id is ${data.userId.slice(0,9)}.....,You can login now</p>`

    data.secret
  } catch (error) {
    localStorage.removeItem('token')
    resultDOM.innerHTML = `<p>${error.response.data.msg}</p>`
  }
})

const checkToken = () => {
  tokenDOM.classList.remove('text-success')

  const user = JSON.parse(localStorage.getItem('user'));
  let token;
  if (user) {
    token = user.token;
  }
  if (token) {
    tokenDOM.textContent = 'token present'
    tokenDOM.classList.add('text-success')
  }
}
checkToken()
