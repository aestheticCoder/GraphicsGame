
/**
 * An axis-aligned bounding box
 */
export class Aabb {

    /**
     * Constructs a (invalid) bounding box.
     */
    constructor() {
        this.min = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE]; //min of point range
        this.max = [-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE]; //max of point range
    }

    /**
     * Adds a point to this bounding box.  The bounding box will expand (if necessary)
     * to contain the point.
     * 
     * @param {Number} x the x-coordinate of the point to add
     * @param {Number} y the y-coordinate of the point to add
     * @param {Number} z the z-coordinate of the point to add
     */
    add( x, y, z ) {
        this.min[0] = Math.min(x, this.min[0]);
        this.min[1] = Math.min(y, this.min[1]);
        this.min[2] = Math.min(z, this.min[2]);

        this.max[0] = Math.max(x, this.max[0]);
        this.max[1] = Math.max(y, this.max[1]);
        this.max[2] = Math.max(z, this.max[2]);
    }

    ////Part of my unsuccessful collision implementation
    //These are the two collision check methods
    //The 2box one has been tested and works as I can get constant collisions
    //detected
    //Likely issue is it that the boxes are set up wrong or there is some other issue
    //defining the boxes. These checks should work perfectly tho.

    //Px, Py, Pz are the points coords
    //BminX -BmaxX is the range of the x axis of the AABB
    //BminY - BmaxY is range of y axis
    //BminZ - BmaxZ is range of z axis
    //this checks if a collision occurred between the point P and the box B
    isPointInsideAABB( point, box) {
        return (point.x >= box.min[0] && point.x <= box.max[0]) &&
            (point.y >= box.min[1] && point.y <= box.max[1]) &&
            (point.z >= box.min[2] && point.z <= box.max[2]);
    }

    //similar to point/box test, but instead checks once per axis
    //basically checking if the ranges of the two boxes axises overlap
    //this does work
    checkIntersect2Box(b){
        return ((this.min[0] <= b.max[0] && this.max[0] >= b.min[0]) &&
            (this.min[1] <= b.max[1] && this.max[1] >= b.min[1]) &&
            (this.min[2] <= b.max[2] && this.max[2] >= b.min[2]));
    }


}
