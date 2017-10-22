function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
  q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

function start() {
  var params = getHashParams();

  if (params.exactMatches) {
    for (int i = 0; i < exactMatches.length; i++) {
      
    }
  }
}