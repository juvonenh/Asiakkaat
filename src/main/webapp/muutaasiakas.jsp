<%@include file="header.jsp" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<script src="scripts/main.js"></script>
<script src="scripts/io.js"></script>
<link rel="stylesheet" type="text/css" href="css/tyyli.css">
<title>Asiakastietojen muuttaminen</title>
</head>
<body onload="asetaFocus('etunimi')"
	onkeydown="tutkiKey(event, 'paivita')">
	<form name="lomake">
		<table>
			<thead>
				<tr>
					<th colspan="5" class="oikealle"><a id="linkki"
						href="listaaasiakkaat.jsp">Takaisin listaukseen</a></th>
				</tr>
				<tr>
					<th>Etunimi</th>
					<th>Sukunimi</th>
					<th>Puhelinnumero</th>
					<th>Sähköposti</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><input type="text" name="etunimi" id="etunimi" /></td>
					<td><input type="text" name="sukunimi" id="sukunimi" /></td>
					<td><input type="text" name="puhelin" id="puhelin" /></td>
					<td><input type="text" name="sposti" id="sposti" /></td>
					<td><input type="button" value="Hyväksy"
						onclick="tutkiJaPaivita()" /></td>
				</tr>
			</tbody>
		</table>
		<input type="hidden" name="asiakas_id" id="asiakas_id">
	</form>
	<p id="ilmo"></p>
</body>
<script>
	haeAsiakas();
</script>
</html>