import * as mat4 from './gl-matrix/mat4.js';
import * as vec3 from './gl-matrix/vec3.js';
//import {Aabb} from './aabb.js';



/**
 * A class that represents a camera's coordinate system.
 */
export class Camera {

    /**
     * Constructs the camera with a default position and orientation.
     * 
     * Default position: (0,1,5)
     * Default orientation:  target (0,0,0), up( 0,1,0 )
     */
    constructor() {
        // Camera's position
        this.eye = [0,0,0];

        // Camera's u, v, w axes
        this.u = [1,0,0];
        this.v = [0,1,0];
        this.w = [0,0,1];
        
        // Orient the camera to a default orientation
        this.orient( [0,1,5], [0,0,0], [0,1,0] );
        
        // Rotation and translation matrix, initially set to I
        this.rotation = mat4.create();
        this.translation = mat4.create();

        ////Part of my unsuccessful collision implementation
        // This where I make the bounding box for the camera/ player
        /*
        //Add camera to aabb
        this.camBox = new Aabb();

        //This one just adds the camera poistion as the only point  to the box
        //I didn't use this one too much
        camBox.add(0,0,0);

        //This one makes a small tetrahedron that surrounds the camera closely
        // as the bounding box for the camera, so that there was still some kind of
        // "box" around the camera/player
        //This was the main one I used
        this.camBox.add(0.1,0.1,0.1);
        this.camBox.add(0,0,0.1);
        this.camBox.add(0.1,-0.1,-0.1);
        this.camBox.add(-0.1,0.1,0);

         */
    }

    /**
     * Orient the camera
     * 
     * @param {vec3} eye camera position 
     * @param {vec3} at camera target (the point the camera looks towards) 
     * @param {vec3} up the up direction 
     */
    orient( eye, at, up ) {
        // Set the camera's position
        this.eye = eye;

        // Compute the camera's axes
        // w = eye - at
        vec3.subtract(this.w, this.eye, at);
        vec3.normalize(this.w, this.w);
        // u = up x w
        vec3.cross(this.u, up, this.w);
        vec3.normalize(this.u, this.u);
        // v = w x u
        vec3.cross(this.v, this.w, this.u);
        vec3.normalize(this.v, this.v);
    }

    /**
     * Compute and return the view matrix for this camera.  This is the
     * matrix that converts from world coordinates to camera coordinates.
     * 
     * @param {mat4} out the view matrix is written to this parameter 
     */
    getViewMatrix( out ) {
        // The inverse rotation
        mat4.set(this.rotation, 
            this.u[0], this.v[0], this.w[0], 0, 
            this.u[1], this.v[1], this.w[1], 0,
            this.u[2], this.v[2], this.w[2], 0, 
            0, 0, 0, 1);

        // The inverse translation
        this.translation[12] = -this.eye[0];
        this.translation[13] = -this.eye[1];
        this.translation[14] = -this.eye[2];

        // View matrix = inverse rotation * inverse translation
        mat4.multiply(out, this.rotation, this.translation);
    }

    /**
     * Rotates this camera around the camera's u-axis by vertAngle, and
     * around the y-axis by horizAngle.  
     * 
     * @param {Number} horizAngle horizontal rotation angle (radians)
     * @param {Number} vertAngle vertical rotation angle (radians)
     */
    orbit( horizAngle, vertAngle ) {

        //Used in birds eye mode
        let rMtrx = mat4.create();
        mat4.rotateY(rMtrx, rMtrx, horizAngle);
        mat4.rotate(rMtrx,rMtrx, vertAngle, this.u);

        //Transform the camera's axis and position
        vec3.transformMat4(this.eye, this.eye, rMtrx);
        vec3.transformMat4(this.u, this.u, rMtrx);
        vec3.transformMat4(this.v, this.v, rMtrx);
        vec3.transformMat4(this.w, this.w, rMtrx);
    }

    /**
     * Rotates the camera's axes (but not its position) around the camera's u-axis
     * by vertAngle and around the y-axis by horizAngle.
     * 
     * @param {Number} horizAngle horizontal rotation angle (radians)
     * @param {Number} vertAngle vertical rotation angle (radians)
     */
    turn( horizAngle, vertAngle ) {

        let rMtrx = mat4.create();
        mat4.rotateY(rMtrx, rMtrx, horizAngle);
        mat4.rotate(rMtrx,rMtrx, vertAngle, this.u);

        //Transform the camera's axis
        vec3.transformMat4(this.u, this.u, rMtrx);
        vec3.transformMat4(this.v, this.v, rMtrx);
        vec3.transformMat4(this.w, this.w, rMtrx);
    }

    /**
     * Moves the camera's position along the u and v axes without changing
     * the camera's orientation.
     * @param {Number} deltaU distance to move along camera's u axis 
     * @param {Number} deltaV distance to move along camera's v axis
     */
    track( deltaU, deltaV ) {
        //DeltaU
        vec3.scaleAndAdd(this.eye, this.eye, this.u, deltaU);

        //Delta V is unused as the camera can't go up or down, in play mode

    }

    /**
     * Move the camera's position along the camera's w axis without changing
     * the camera's orientation.
     * 
     * @param {Number} delta distance to move along the camera's w axis 
     */
    dolly( delta ) {
        //This is the dolly for birdseye mode
        vec3.scaleAndAdd(this.eye, this.eye, this.w, delta)
    }

    /**
     * Move the camera's position along the camera's w axis without changing
     * the camera's orientation.
     *
     * @param {Number} delta distance to move along the camera's w axis
     */
    playerWalk( delta ) {
        //This is a modified dolly, for play mode
        //It prevents the player from going up or down vertically
        //So that the player feels stuck to the ground, or feels some kind of gravity
        //It's done by setting the y axis of the w vector to 0
        let a = [-this.w [0], 0, -this.w[2] ];

        //DeltaW
        vec3.scaleAndAdd(this.eye, this.eye, a, delta)
    }


    ////Part of my unsuccessful collision implementation
    /*
    playerBounce(){
        console.log("Hit the wall");
        //planned on writing more code to handle the collision once I had the collision
        //checks working correctly... never got past this part unfortunately

        //Ideally if the checks worked correctly, I thought about reversing the cameras w vector, by
        //either flipping the sign values for the w vector
        //or by using the surface normal of the surface hit as a the cameras w vector temporally to
        //mimic a bounce effect of the surface.
    }

    getCameraAaBb(){
        return this.camBox;
    }
     */
}