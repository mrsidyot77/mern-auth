import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-6">About MERN Authentication System</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-lg leading-relaxed">
          The <strong>MERN Authentication System</strong> is a full-stack application built using the MERN stack—MongoDB, Express.js, React.js, and Node.js. It provides a secure and efficient way to authenticate users using JSON Web Tokens (JWT). JWTs are compact, URL-safe tokens that are digitally signed to ensure the integrity and authenticity of the information they contain.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>User Registration and Authentication:</strong> Secure registration and login functionality with hashed passwords.</li>
          <li><strong>JWT-based Authentication:</strong> Users receive JWT tokens after login to access protected resources.</li>
          <li><strong>Role-Based Access Control:</strong> Define different user roles and restrict access based on roles.</li>
          <li><strong>Secure Password Management:</strong> Passwords are hashed using secure algorithms before being stored.</li>
          <li><strong>Protected Routes:</strong> Ensure that only authenticated users can access certain routes.</li>
          <li><strong>Account Management:</strong> Users can update their account details, including password changes.</li>
          <li><strong>Error Handling:</strong> Comprehensive error messages for better user experience.</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <p className="text-lg leading-relaxed mb-4">
          The system operates by allowing users to register with their details, which are securely stored in MongoDB after hashing the password. When users log in, they receive a JWT token that must be included in the Authorization header for all subsequent requests to access protected routes. The server verifies the token for every request to ensure it is valid before granting access.
        </p>
        <p className="text-lg leading-relaxed">
          The system also supports refreshing tokens, allowing users to maintain their sessions without needing to log in frequently. If a user tries to access a protected route without a valid token, they will receive an error message.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Security Considerations</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Token Secret:</strong> The JWT token is signed with a secret key that is securely stored and never exposed.</li>
          <li><strong>HTTPS:</strong> Deploy the system over HTTPS to ensure that all data, including tokens, is transmitted securely.</li>
          <li><strong>Token Storage:</strong> JWT tokens are securely stored on the client side, typically in HTTP-only cookies or secure storage mechanisms.</li>
          <li><strong>XSS and CSRF Protection:</strong> Implement additional security measures to protect against common web vulnerabilities.</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>MongoDB:</strong> NoSQL database used to store user data securely.</li>
          <li><strong>Express.js:</strong> Web framework for Node.js that handles routing, middleware, and server-side logic.</li>
          <li><strong>React.js:</strong> Frontend library used to build a responsive and interactive user interface.</li>
          <li><strong>Node.js:</strong> JavaScript runtime used for server-side development.</li>
          <li><strong>JSON Web Token (JWT):</strong> Standard used to securely transmit information between the client and server.</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Future Enhancements</h2>
        <p className="text-lg leading-relaxed">
          Future updates to the MERN Authentication System may include social login integrations (e.g., Google, Facebook), two-factor authentication (2FA), and account recovery options to enhance security and user convenience.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
        <p className="text-lg leading-relaxed">
          The MERN Authentication System is designed to provide a robust, secure, and scalable solution for managing user authentication in modern web applications. By leveraging JWT tokens, it ensures that only authenticated users can access protected resources while maintaining a smooth and seamless user experience.
        </p>
      </section>
    </div>
  );
};

export default About;
