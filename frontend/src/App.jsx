import './App.css'
import { SignedIn, SignedOut,SignOutButton, SignInButton, UserButton } from '@clerk/clerk-react';


function App() {

  return (
    <>
      <h1>
        Welcome to the interview
      </h1>
      <SignedOut>
      <SignInButton mode='modal'>
        <button className="">Sign up</button>
      </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton/>
      </SignedIn>
      <UserButton/>
    </>
  )
}

export default App
