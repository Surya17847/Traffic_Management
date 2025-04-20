import { Auth } from 'aws-amplify/auth'; // ✅ correct for v5+

export default function SignUp() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name } = e.target.elements;
    
    try {
      await Auth.signUp({
        username: email.value,
        password: password.value,
        attributes: {
          email: email.value,
          name: name.value
        }
      });
      alert('Check your email for verification!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  );
}