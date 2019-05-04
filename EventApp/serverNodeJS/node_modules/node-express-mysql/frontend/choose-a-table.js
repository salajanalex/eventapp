app.controller('choose-a-table-list',function($scope,$http){
	$http
		.get('../tables')
		.then(function(ans){
			if(ans.data){
				$scope.tables=ans.data
			}
		})
		.catch(function(ans){
			console.log('catch',ans)
			alert(ans)
		})
	$scope.clickChooseTable	=function(table){
		$scope.$emit('clickChooseTable',table)
	}
})