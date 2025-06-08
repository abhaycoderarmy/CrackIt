// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js"; // Import User model

// const isAuthenticated = async (req, res, next) => {
//     try {
//         // Check for token in cookies first, then in Authorization header
//         let token = req.cookies.token;
        
//         if (!token) {
//             const authHeader = req.headers.authorization;
//             if (authHeader && authHeader.startsWith('Bearer ')) {
//                 token = authHeader.substring(7); // Remove 'Bearer ' prefix
//             }
//         }

//         // Debug logging
//         console.log('Token received:', token);
//         console.log('Token type:', typeof token);
//         console.log('Token length:', token ? token.length : 'null');

//         // Check for invalid tokens - including string "undefined" and "null"
//         if (!token || 
//             token === 'undefined' || 
//             token === 'null' || 
//             token === 'Bearer undefined' ||
//             token.length < 50 || // JWT tokens are typically much longer
//             !token.includes('.')) { // JWT tokens must contain dots
            
//             console.log('Invalid token detected:', token);
//             return res.status(401).json({
//                 message: "User not authenticated - invalid token",
//                 success: false,
//             });
//         }

//         const decode = await jwt.verify(token, process.env.SECRET_KEY);
//         if (!decode) {
//             return res.status(401).json({
//                 message: "Invalid token",
//                 success: false
//             });
//         }

//         // Fetch user details and attach to req.user (needed for role checking)
//         const user = await User.findById(decode.userId).select('-password');
//         if (!user) {
//             return res.status(401).json({
//                 message: "User not found",
//                 success: false
//             });
//         }

//         req.user = user; // Attach full user object
//         req.id = decode.userId; // Keep this for backward compatibility
//         next();
//     } catch (error) {
//         console.log(error);
//         return res.status(401).json({
//             message: "Invalid token",
//             success: false
//         });
//     }
// }

// export default isAuthenticated;

// middlewares/isAuthenticated.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // Import User model

const isAuthenticated = async (req, res, next) => {
    try {
        // Check for token in cookies first, then in Authorization header
        let token = req.cookies.token;
        
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' prefix
            }
        }

        // Debug logging
        console.log('Token received:', token);
        console.log('Token type:', typeof token);
        console.log('Token length:', token ? token.length : 'null');

        // Check for invalid tokens - including string "undefined" and "null"
        if (!token || 
            token === 'undefined' || 
            token === 'null' || 
            token === 'Bearer undefined' ||
            token.length < 50 || // JWT tokens are typically much longer
            !token.includes('.')) { // JWT tokens must contain dots
            
            console.log('Invalid token detected:', token);
            return res.status(401).json({
                message: "User not authenticated - invalid token",
                success: false,
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }

        // Fetch user details and attach to req.user (needed for role checking)
        const user = await User.findById(decode.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        req.user = user; // Attach full user object
        req.id = decode.userId; // Keep this for backward compatibility
        next();
    } catch (error) {
        console.log('Authentication error:', error);
        return res.status(401).json({
            message: "Invalid token",
            success: false
        });
    }
}

// Export both as default and named export for flexibility
export default isAuthenticated;
export { isAuthenticated };