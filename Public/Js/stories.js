$(function(){
	$('#storyform').validate({
		rules: {
			sentence: {
			  required: true
			}			
		}
	});
	
	$('#end').click(function(){
		return confirm("Do you really want to close the story for good?");		
	});
});