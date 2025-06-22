interface userAccount {
  username: string,
  password: string
}

export async function GetAuthToken({username, password}: userAccount) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/user/auth`, {
    method: "POST",
    body:  JSON.stringify({
      username,
      password
    })
  })

  return response
}

export async function UserLogout(token: any) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/user/logout`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return response
}

export async function UserStatus(token: any) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/user/status`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return response
}

export async function UserPages(token: any) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/user/pages`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return response
}
