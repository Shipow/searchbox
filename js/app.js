var clearBtn = document.getElementById("clear-q");
var inputQ = document.getElementById("q");

inputQ.addEventListener('input', function(){
    clearBtn.className = "";
});

clearBtn.onclick=function() {
  inputQ.value = '';
  inputQ.focus();
  clearBtn.className = "hide";
};
