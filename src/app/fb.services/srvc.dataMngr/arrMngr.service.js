(function(angular) {
    "use strict";

    /** ngInject */
    function arrMngrService($q, afEntity, $log) {
        var vm = this;
        vm.ref = ref;
        vm.load = load;
        vm.save = save;
        vm.remove = remove;
        vm.destroy = destroy;
        vm.add = add;
        vm.index = index;
        vm.updateRecord = updateRecord;
        vm.get = getRec;
        vm.updateNestedArray = updateNestedArray;
        vm.getNestedKey = getNestedKey;
        vm.key = key;
        vm.buildArr = buildArr;
        vm.buildArrRecord = buildArrRecord;

        function buildArr(path) {
            return $q.when(afEntity.set("array", path))
                .then(function(response) {
                    return response;
                })
                .catch(function(err) {
                    return $q.reject(err);
                })
        }

        function buildArrRecord(path, id) {
            return buildArr(path)
                .then(function(response) {
                    return getRec(response, id);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });

        }

        function ref(fb) {
            return fb.$ref();
        }

        function load(fb, result) {
            if (angular.isUndefined(result)) {
                return fb.$loaded();
            } else {
                return fb.$loaded(result.success, result.failure);
            }
        }

        function save(path, rec) {
            return buildArr(path)
                .then(function(response) {
                    return response.$save(rec);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

        function remove(fb, val, result) {
            if (angular.isUndefined(result)) {
                return fb.$remove(val);
            } else {
                return fb.$remove(val)
                    .then(result.success, result.failure);
            }
        }

        //TODO: add arg for arr on save -wont work
        function updateRecord(path, id, data) {
					//TODO: remove $q.when
            return $q.when(buildArrRecord(path, id))
                .then(function(response) {
                    return forProperties(response, data)
                })
                .then(function(response) {
                    return vm.save(path, response);
                })
                .catch(function(err) {
                    $q.reject(err)
                });
        }


        function updateItem(rec, prop, val) {
            rec[prop] = val;
        }


        function forProperties(rec, obj) {
            var key, str;
            for (key in obj) {
                str = key.toString();
                updateItem(rec, str, obj[str]);
            }
            return rec;

        }


        function destroy(fb) {
            return fb.$destroy();
        }

        function key(fb, val) {
            return fb.$keyAt(val);
        }

        function getRec(fb, val) {
            return fb.$getRecord(val);
        }

        function index(fb, val) {
            return fb.$indexFor(val);
        }

        function add(fb, val, result) {
            if (angular.isUndefined(result)) {
                return fb.$add(val);
            } else {
                return fb.$add(val)
                    .then(result.success, result.failure);
            }
        }

        //untested - this fn doesnt seem to be worth the abstraction
        function updateNestedArray(val, col, path, data) {
            return getNestedKey(val, col, path)
                .then(function(response) {
                    return arrMngr
                        .updateRecord(path, response, data);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });

        }

        function getNestedKey(val, col, path) {
            //TODO: add constrain so only iterate over recent/active, etc items
						//TODO: remove $q.when()
            return $q.when(iterateOverColumns(val, col, path))
                .then(function(response) {
                    return response;
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

        function iterateOverColumns(val, col, path) {
            var nestedKey;
            return buildArr(path)
                .then(function(response) {
                    response.forEach(function(item) {
                        if (item[col] === val) {
                            nestedKey = item.$id;
                        }
                    });
                    if (nestedKey) {
                        return nestedKey;
                    } else {
                        throw new Error("Foreign key: " + col + " with a value of " + val + " was not found.");
                    }
                });
        }
    }

    angular.module("fb.srvc.dataMngr")
        .service("arrMngr", arrMngrService);

})(angular);
