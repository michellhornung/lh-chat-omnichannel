function clearCookie(){
	/* VALIDA SE O COOKIE EXISTE */
	if($.cookie("cookieGEO")){
		 /*LIMPA O COOKIE  */
		$.removeCookie("cookieGEO", {path: "/"});
	}
	
	if($.cookie("cookieREL")){
		 /*LIMPA O COOKIE  */
		$.removeCookie("cookieREL", {path: "/"});
	}
	
	if($.cookie("cookieDSC")){
		 /*LIMPA O COOKIE  */
		$.removeCookie("cookieDSC", {path: "/"});
	}
	
	/*if($.cookie("cookieMON")){
		 LIMPA O COOKIE  
		$.removeCookie("cookieMON", {path: "/"});
	}*/
	
	if($.cookie("cookieGRV")){
		 /*LIMPA O COOKIE  */
		$.removeCookie("cookieGRV", {path: "/"});
	}
	
	if($.cookie("cookieTAR")){
		 /*LIMPA O COOKIE  */
		$.removeCookie("cookieTAR", {path: "/"});
	}
	
	if($.cookie("cookieCOK")){
		 /*LIMPA O COOKIE  */
		$.removeCookie("cookieCOK", {path: "/"});
	}
	
	if($.cookie("cookieAST")){
		 /*LIMPA O COOKIE  */
		$.removeCookie("cookieAST", {path: "/"});
	}
	
	if($.cookie("cookieDSH")){
		 /*LIMPA O COOKIE  */
		$.removeCookie("cookieDSH", {path: "/"});
	}
	
	if($.cookie("customerSelected")){
		/*LIMPA O COOKIE  */
		$.removeCookie("customerSelected", {path: "/"});
	}
}