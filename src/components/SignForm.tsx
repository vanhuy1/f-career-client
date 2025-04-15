// 'use client';

// import { LoginRequest } from '@/schemas/Auth';
// import { authService } from '@/services/api/auth/auth-example';
// import {
//   loginFailure,
//   loginStart,
//   loginSuccess,
// } from '@/services/state/authSlice';
// import { useAppDispatch } from '@/store/hooks';
// import { useState } from 'react';

// const SigninForm = () => {
//   const [credentials, setCredentials] = useState<LoginRequest>({
//     email: '',
//     password: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<boolean>(false);
//   const dispatch = useAppDispatch();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCredentials({
//       ...credentials,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);
//     dispatch(loginStart());

//     try {
//       const response = await authService.login(credentials);
//       console.log('Login successful:', response);

//       // Store token in localStorage
//       if (response.access_token) {
//         localStorage.setItem('accessToken', response.access_token);
//       }
//       console.log('auth example', response);
//       dispatch(loginSuccess(response));
//       setSuccess(true);
//     } catch (err) {
//       dispatch(loginFailure(err as string));
//       setError(typeof err === 'string' ? err : 'Login failed');
//       console.error('Login error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="mb-4 text-2xl">Login Example</h1>
//       {success && (
//         <div className="mb-4 rounded bg-green-100 p-3">
//           Login successful! Token has been stored.
//         </div>
//       )}
//       {error && (
//         <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="mb-1 block">Email:</label>
//           <input
//             type="email"
//             name="email"
//             value={credentials.email}
//             onChange={handleChange}
//             className="w-full rounded border p-2"
//             required
//           />
//         </div>
//         <div>
//           <label className="mb-1 block">Password:</label>
//           <input
//             type="password"
//             name="password"
//             value={credentials.password}
//             onChange={handleChange}
//             className="w-full rounded border p-2"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-blue-300"
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// };
// export default SigninForm;
