//Check the keyboard in order to know wich key has been pressed by the user
function checkCapsLock(e) {
	
	var capsLockON;
	
	keyCode 	= e.keyCode ? e.keyCode : e.which;
	shiftKey 	= e.shiftKey ? e.shiftKey : ((keyCode == 16) ? true : false);
	
	if(keyCode == 13){
		document.getElementById('btnLogin').click();
	}else{
		
		if (((keyCode >= 65 && keyCode <= 90) && !shiftKey)
				|| ((keyCode >= 97 && keyCode <= 122) && shiftKey)) {
			capsLockON = true;
		} else {
			capsLockON = false;
		}
		if (capsLockON)
			document.getElementById('divWarningCapsLock').style.display = 'block';
		else
			document.getElementById('divWarningCapsLock').style.display = 'none';
	}
}
