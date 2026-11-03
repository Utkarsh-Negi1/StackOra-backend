 # stackora Apis

## auth router
 -post/signup
 -post/login
 -post/logout

## profile  router
-get/profile/view
-patch/profile/edit
-patch/profile/password

## connection requestRouter
- post/request/send/intersted/:userId
-post/request/send/ignored/:userId
-post/request/review/accepted/:requestId
-post/request/review/rejected/:requestId

 ## userRouter
-get/user/connections
-get/user/requests
-get/user/feed -- gets you the profiles of other users on platform

