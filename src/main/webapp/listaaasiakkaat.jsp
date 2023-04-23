<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="css/style.css">
<script src="scripts/main.js"></script>
<title>Asiakastiedot</title>
</head>
<body>
	<table id="listaus">
		<thead>
			<tr>
				<th colspan="2">Hakusana:</th>
				<th><input type="text" id="hakusana"></th>
				<th><input type="button" value="Hae" id="hakunappi" onclick="haeAsiakkaat()"></th>
			</tr>

			<tr>
				<th>Etunimi</th>
				<th>Sukunimi</th>
				<th>Puhelinnumero</th>
				<th>Sähköposti</th>
			</tr>
		</thead>
		<tbody id="tbody">
		</tbody>
	</table>
	<span id="ilmo"></span>
	<script>
		haeAsiakkaat();
	</script>
</body>
</html>