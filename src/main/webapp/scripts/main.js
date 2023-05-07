//Funktio lomaketietojen muuttamiseksi JSON-stringiksi
function serialize_form(form){
	return JSON.stringify(
	    Array.from(new FormData(form).entries())
	        .reduce((m, [ key, value ]) => Object.assign(m, { [key]: value }), {})
	        );	
}

//Funktio arvon lukemiseen urlista avaimen perusteella
function requestURLParam(sParam){
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split("&");
    for (let i = 0; i < sURLVariables.length; i++){
        let sParameterName = sURLVariables[i].split("=");
        if(sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
}

//Tutkitaan lisättävät tiedot ennen niiden lähettämistä backendiin
function tutkiJaLisaa(){
	if(tutkiTiedot()){
		lisaaTiedot();
	}
}

//Tutkitaan päivitettävät tiedot ennen niiden lähettämistä backendiin
function tutkiJaPaivita(){
	if(tutkiTiedot()){
		paivitaTiedot();
	}
}

//Funktio syöttötietojen tarkistamista varten (yksinkertainen)
function tutkiTiedot(){
	let ilmo="";	
	if(document.getElementById("etunimi").value.length<2){
		ilmo="Etunimi ei kelpaa!";	
		document.getElementById("etunimi").focus();	
	}else if(document.getElementById("sukunimi").value.length<2){
		ilmo="Sukunimi ei kelpaa!";
		document.getElementById("sukunimi").focus();
	}else if(!validoiPuhelin(document.getElementById("puhelin").value)) {
		ilmo="Puhelinnumero ei kelpaa!";	
		document.getElementById("puhelin").focus();
	}else if(!validoiSposti(document.getElementById("sposti").value)) {
		ilmo="Sähköposti ei kelpaa!";
		document.getElementById("sposti").focus();	
	}
	if(ilmo!=""){
		document.getElementById("ilmo").innerHTML=ilmo;
		setTimeout(function(){ document.getElementById("ilmo").innerHTML=""; }, 3000);
		return false;
	}else{
		document.getElementById("etunimi").value=siivoa(document.getElementById("etunimi").value);
		document.getElementById("sukunimi").value=siivoa(document.getElementById("sukunimi").value);
		document.getElementById("puhelin").value=siivoa(document.getElementById("puhelin").value);
		document.getElementById("sposti").value=siivoa(document.getElementById("sposti").value);	
		return true;
	}
}

//Funktio puhelinnumeron validoimiseksi
function validoiPuhelin(puhelin) {
  let re = /^\(?(\d{2,3})\)?[- ]?(\d{4,10})$/;

  return re.test(puhelin);
}

//Funktio sähköpostin validoimiseksi, ei suositeltavaa tehdä regexillä tosielämässä!!
function validoiSposti(sposti) {
  let re = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;

  return re.test(sposti);
}

//Funktio XSS-hyökkäysten estämiseksi (Cross-site scripting)
function siivoa(teksti){
	teksti=teksti.replace(/</g, "");//&lt;
	teksti=teksti.replace(/>/g, "");//&gt;
	teksti=teksti.replace(/;/g, "");//&#59; //Puolipisteen esto auttaa suojaamaan SQL-injektioilta, SQL-lausetta ei voi katkaista
	teksti=teksti.replace(/'/g, "''");//&apos; //Auttaa suojaamaan SQL-injektioilta
	return teksti;
}

function varmistaPoisto(asiakas_id, nimi){
	//decodeURI() muutetaan enkoodatut merkit takaisin normaaliksi kirjoitukseksi
	if(confirm("Poista asiakas " + decodeURI(nimi) + "?")){
		poistaAsiakas(asiakas_id, nimi);
	}
}

function asetaFocus(target){
	document.getElementById(target).focus();	
}

//Funktio Enter-nappiin. Kutsu bodyn onkeydown()-metodista.
function tutkiKey(event, target){	
	if(event.keyCode==13){//13=Enter
		if(target=="listaa"){
			haeAsiakkaat();
		}else if(target=="lisaa"){
			tutkiJaLisaa();
		}else if(target=="paivita"){
			tutkiJaPaivita();
		}
	}		
}
