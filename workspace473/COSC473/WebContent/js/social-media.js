// Set up facebook widget
!function(e,t,n){
	var o,r=e.getElementsByTagName(t)[0];
	e.getElementById(n)||(o=e.createElement(t),o.id=n,o.src="//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5",r.parentNode.insertBefore(o,r))
}(document,"script","facebook-jssdk"),
// Set up twitter widget
!function(e,t,n){
	var o,r=e.getElementsByTagName(t)[0],s=/^http:/.test(e.location)?"http":"https";
	e.getElementById(n)||(o=e.createElement(t),o.id=n,o.src=s+"://platform.twitter.com/widgets.js",r.parentNode.insertBefore(o,r))
}(document,"script","twitter-wjs");