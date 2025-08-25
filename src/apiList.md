# apis

authRouter
-POST /signup
-POST /login
-POST /logout

profileRouter
-GET /Profile
-PATCH /Profile/edit
-PATCH /Profile/patch/password

connectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:reqid
-POST /request/review/rejected/:reqid


userRouter
 -GET user/connections
 -GET user/requests/received
 -GET user/feed - gets you the profiles of other users on platform
 
 /feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
 /feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)

 Status: ignore, interested, accepted, rejected
