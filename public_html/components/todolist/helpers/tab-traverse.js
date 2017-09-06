angular.module("app").factory("TabTraverseHelper", function () {
    return {
        DIRECTION: {
            UP: 1,
            DOWN: 2
        },
        traverse: function (traversedIndex, traversedArray, direction) {
            // Initialize index bounds
            var firstIndexByDirection = null;
            var lastIndexByDirection = null;
            if (direction === this.DIRECTION.UP) {
                firstIndexByDirection = traversedArray.length - 1;
                lastIndexByDirection = 0;
            } else if (direction === this.DIRECTION.DOWN) {
                firstIndexByDirection = 0;
                lastIndexByDirection = traversedArray.length - 1;
            }

            // Set index to first index if set to null
            if (traversedIndex === null) {
                return firstIndexByDirection;
            }

            // Move index by 1
            if (direction === this.DIRECTION.UP) {
                traversedIndex--;
            } else if (direction === this.DIRECTION.DOWN) {
                traversedIndex++;
            }

            // Roll over if out of bounds
            if ((direction === this.DIRECTION.DOWN && traversedIndex > lastIndexByDirection)
                    || direction === this.DIRECTION.UP && traversedIndex < lastIndexByDirection) {
                traversedIndex = firstIndexByDirection;
            }

            return traversedIndex;
        }
    };
});