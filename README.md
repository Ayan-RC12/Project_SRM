## Features

- Login and Sign Up into your account
- Add new contacts either personal or professional
- Edit and delete the contacts
- Get every single contact

# Contact Keeper
Contact keeper is where you can store you personal and professional contacts in an organized way.
The newly visiting users have yo first signup for the web app and afterwards when they visit the web app they can simply login.

There are two tabs Contact form and Contacts. In the form the users can add a contact where they have to put the contact details such as the name, phone number, email address and they have to specify if it is a personal or a professional contact. After adding a contact/contacts they can view them in Contacts tab where all added contacts are laid down. 

A user can add as many contants as he wants but if he wants to view a perticular contact the can filter them out by the simply searching the contacts by name or email or by their phone number.

# Problems We Are Trying To Solve  
To summarize the issues we faced in the peoject, and why we had to use `// eslint-disable-next-line` at all is that all our data fetching methods are in our context states (AuthState.js and ContactState.js) and passed down to all our components via the context Provider. The problem with this is that every time we update our context state we create a new function. If we include these functions in our useEffect dependency array (as the linter suggests) then each time we fetch data and our reducer runs it updates the context which triggers a re-render (creating a whole set of new functions). The useEffect dependency sees it as a new function and triggers another render which again updates the state when we call the function in our useEffect, which triggers another re-render and so on.... infinite loop of re-rendering.
Even though these functions are called the same and do the same thing, in memory
they are different functions.

The solution is not to add an empty array and tell the linter to ignore it (trying to make a componentDidMount out of useEffect), but to think in terms of hooks and functions.
We should keep our functions pure where possible and take all our data fetching methods out of context state.
You will see all of our action creators have been taken out of the context, this gurantees that the functions never change with a update to state and don't need to be added to the dependency array in useEffect.
Each function now takes a dispatch argument as the first parameter which is passed in at the time of invocation. We can safely provide the dispatch via our context as react gurantees that a dispatch returned from useReducer is static and won't change. So the dispatch in our context state will not be a problem.
Here is our new `getContacts` function:

```js
export const getContacts = async (dispatch) => {
  try {
    const res = await axios.get('/api/contacts');

    dispatch({
      type: GET_CONTACTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CONTACT_ERROR,
      payload: err.response.msg
    });
  }
};
```

As you can see it takes `disptach` as the first argument and it is exported as a named export so we can use it.

We also make a new custom hook to easily consume our auth state and dispatch in our components..

```js
export const useContacts = () => {
  const { state, dispatch } = useContext(ContactContext);
  return [state, dispatch];
};
```

We can then use our new hook like so (example taken from [Contacts.js](https://github.com/bradtraversy/contact-keeper/blob/hookfix/client/src/components/auth/Login.js))

_Import it along with our methods_

```js
import { useContacts, getContacts } from '../../context/contact/ContactState';
```

_Use the hook to get our state and dispatch_

```js
const [contactState, contactDispatch] = useContacts();

const { contacts, filtered } = contactState;
```

_And in our useEffect to fetch our users contacts_

```js
useEffect(() => {
  getContacts(contactDispatch);
}, [contactDispatch]);
```

Ultimately a good rule of thumb when using react context along with hooks would be to not provide functions in your context state, especially if those functions have side effects. The only exception being the dispatch returned from useReducer.

### LOGIN PAGE
<img src="./screnshots/LOgin.png"/>

### REGISTRATION PAGE
<img src="./screnshots/Registration.png"/>

### CONTACT FORM
<img src="./screnshots/Screenshot 2022-05-08 141934.png"/>

### CONTACTS
<img src="./screnshots/contacts.png"/>

## Postman Routes

Test your routes in PostMan with the following...

### Users & Authentication Routes

1. Register a new user - POST http://localhost:5000/api/users

   | Headers      |                  |
   | ------------ | ---------------- |
   | key          | value            |
   | Content-Type | application/json |

Body

```JSON
{
"name": "Sam Smith",
"email": "sam@gmail.com",
"password": "123456"
}
```

2. Login a user - POST http://localhost:5000/api/auth

| Headers      |                  |
| ------------ | ---------------- |
| key          | value            |
| Content-Type | application/json |

Body

```JSON
{
"email": "sam@gmail.com",
"password": "123456"
}
```

3. Get logged in user - GET http://localhost:5000/api/auth

| Headers      |                  |
| ------------ | ---------------- |
| key          | value            |
| Content-Type | application/json |
| x-auth-token | <VALID_TOKEN>    |

### Contacts Routes

1. Get a users contacts - GET

| Headers      |                  |
| ------------ | ---------------- |
| key          | value            |
| Content-Type | application/json |
| x-auth-token | <VALID_TOKEN>    |

2. Add a new contact - POST http://localhost:5000/api/contacts

| Headers      |                  |
| ------------ | ---------------- |
| key          | value            |
| Content-Type | application/json |
| x-auth-token | <VALID_TOKEN>    |

Body

```JSON
{
"name": "William Williams",
"email": "william@gmail.com",
"phone": "77575894"
}
```

3. Update a contact - PUT http://localhost:5000/api/contacts/<CONTACT_ID>

| Headers      |                  |
| ------------ | ---------------- |
| key          | value            |
| Content-Type | application/json |
| x-auth-token | <VALID_TOKEN>    |

Body

```JSON
{
"phone": "555555"
}
```

4. Delete a contact - DELETE http://localhost:5000/api/contacts/<CONTACT_ID>

| Headers      |                  |
| ------------ | ---------------- |
| key          | value            |
| Content-Type | application/json |
| x-auth-token | <VALID_TOKEN>    |

## Usage

Install dependencies

```bash
npm install
cd client
npm install
```

### Mongo connection setup

Edit your /config/default.json file to include the correct MongoDB URI

### Run Server

```bash
npm run dev     # Express & React :3000 & :5000
npm run server  # Express API Only :5000
npm run client  # React Client Only :3000
```
