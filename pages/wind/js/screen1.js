// Call startup function onDeviceReady when device is ready
$(document).ready(function () {
    //document.addEventListener("deviceready", onDeviceReady, false);
    onDeviceReady();
});

function onDeviceReady(){
	console.log("onDeviceReady");
	var vm = new screen1ViewModel();

    var session = window.localStorage.getItem(storageKeys.windSessionInput);
   
    if(session)
    {
        var input = JSON.parse(session);
        input = input.data.screen2ViewModel;
        vm.projectName(input.screen1ViewModel.projectName);
        vm.user(input.screen1ViewModel.user);
        vm.parapet(input.screen1ViewModel.parapet);
        vm.currentlySelectedLevel(input.screen1ViewModel.currentlySelectedLevel)
        vm.levels(input.screen1ViewModel.levels);
    }

	bindUI(vm);
	ko.applyBindings(vm);
}

function bindUI(viewModel){
	$("#a-next").click(function() {
        var copy = viewModel;
        window.localStorage.setItem(vmKeys.windScreen1, ko.toJSON(copy));
        navigateTo("screen2.html");
    });
    
    $("input, select, textarea").bind("focus",function() {
        $(".footer").addClass("footerkeyboardopen");
    });

    $("input, select, textarea").bind("blur",function() {
        $(".footer").removeClass("footerkeyboardopen");
    });
} 