/**
 * Name: Alex Schuster
 * Date: 05/19/2020
 * Assignment: Graphics Final Project
 * Course/Semester: CS412 Spring 2020
 * Basic Description: The program below, is my final project for Graphics CS412. I made a "game - like"
 *                     world, which could be the start of a full browser game. My "game" is called Amazed,
 *                     the goal of the game is to get to the center of the maze to find the trophy. In this
 *                     case the trophy is a player-sized golden astronaut. By properly navigating the maze
 *                     player can find their way to the center, there is more than one way to get there.
 *                     The maze was also designed to be hard to solve, and is intentionally confusing in some
 *                     parts to add some difficulty to the game. The game utilizes multiple textures to distinguish
 *                     the parts of the world, using a hedge texture for the walls and the topiary tree,
 *                     a soil texture for the ground, and a golden texture for the astronaut.
 *                     This 'game' was also intended to have a collision system so that the player couldn't
 *                     cheat the maze, and walk through the walls to the center. However, due to the limits
 *                     of my own abilities, understanding, and time scale of the project they were not
 *                     functional at this time, and are not apart of the final game.
 * Bugs: NA
 * Other Notes: I couldn't get my AABB collision implementation working but I got close,
 *         I tired very hard to get it working but after multiple tries and never
 *         getting farther than constant collisions. I decided that my remaining time
 *         would be better spent making the rest of the project, but I left in my most recent
 *         code related to it so you can at least see how far I got.
 *
 * Turns out after the presentation that I got multiple textures working ... I hope you like my project. :)
 */

import { Grid } from "./grid.js";
import { Camera } from "./camera.js"
import { Controls } from './controls.js';
import { RenderMeshBary } from "./rendermesh-bary.js";
import { makeCube } from './cube.js';
import { makeFlatPlane} from "./flatPlane.js";
import { loadObjMesh } from './objloader.js';
import {loadTexture} from "./loadTexture.js";
//import {Aabb} from './aabb.js';

import * as glMatrix from './gl-matrix/common.js';
import * as mat4 from "./gl-matrix/mat4.js";


let hedgeTexture = null;    // WebGL texture object
let groundTexture = null;    // WebGL texture object
let goldTexture = null;    // WebGL texture object


/**
 * Represents the entire scene.
 */
export class Scene {

    /**
     * Constructs a Scene object.
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {HTMLElement} canvas the canvas element 
     */
    constructor(gl, canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;

        // Variables used to store the model, view and projection matrices.
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();

        // Create the camera object and set to default position/orientation
        this.camera = new Camera();

        //Sets the cameras starting position to birds eye view mode
        this.resetBirdEye();

        // The projection type
        this.projType = "perspective";

        // The camera mode
        this.mode = "mouse";

        // UI manager object
        this.controls = new Controls(this.canvas, this);
        
        // Create the meshes for the scene
        this.grid = new Grid(gl);   // The reference grid
        this.cube = new RenderMeshBary(gl, makeCube());
        this.ground = new RenderMeshBary(gl, makeFlatPlane());

        //Load up the textures for the maze
        // Load the Hedge texture
        loadTexture('data/hedgeTexture.jpg', gl).then((tex) => {
            this.hedgeTexture = tex;
        });

        // Load the Ground texture
        loadTexture('data/soilTexture.jpg', gl).then((tex) => {
            this.groundTexture = tex;
        });

        // Load the Gold texture
        loadTexture('data/goldTexture2.jpg', gl).then((tex) => {
            this.goldTexture = tex;
        });

        // Load the Astronaut/astroMan and the Topiary Tree/tree from their OBJ files.

        //Astronaut Mesh
        this.astroMan = null;
        // this is where you would change the name of the file to get the mesh
        fetch('data/astronaut.obj')
            .then( (response) => {
                return response.text();
            })
            .then( (text) => {
                let objMesh = loadObjMesh(text);
                this.astroMan = new RenderMeshBary(gl, objMesh);
            });

        this.tree = null;
        fetch('data/Lowpoly_tree_sample.obj')
            .then( (response) => {
                return response.text();
            })
            .then( (text) => {
                let objMesh = loadObjMesh(text);
                this.tree = new RenderMeshBary(gl, objMesh);
            });


        /*
        ///Below is my commented out code from my unsuccessful aabb collision implementation
        /// I have left it in for the readers reference and to see just how far I managed to get
        /// I have also left it in just in case the reader or myself wants to go in and try to
        /// pick up where I left off.

        //This was my wall object, functionally the same as the cube
        //object which i used for my walls. This was just being used to
        // test my collision check before I scaled it up to the whole maze.
        this.wall = new RenderMeshBary(gl, makeWall());

        //Aabb set up
        //Getting the bounding box around the camera
        this.cameraAaBb = this.camera.getCameraAaBb();

        //Instanciating the Wall bounding box
        this.wallBox = new Aabb();


        //Add all Vertices to the wall aabb box

        //This box is made using the makeWalls points a input.
        //However, this wall box constantly collides with the camera
        //no matter where the camera is
        //This was probably the closest I got as collision were being registered, just not correctly
        this.wallBox.add( makeWall().points[0][0], makeWall().points[0][1], makeWall().points[0][2]);
        this.wallBox.add( makeWall().points[1][0], makeWall().points[1][1], makeWall().points[1][2]);
        this.wallBox.add( makeWall().points[2][0], makeWall().points[2][1], makeWall().points[2][2]);
        this.wallBox.add( makeWall().points[3][0], makeWall().points[3][1], makeWall().points[3][2]);
        this.wallBox.add( makeWall().points[4][0], makeWall().points[4][1], makeWall().points[4][2]);
        this.wallBox.add( makeWall().points[5][0], makeWall().points[5][1], makeWall().points[5][2]);
        this.wallBox.add( makeWall().points[6][0], makeWall().points[6][1], makeWall().points[6][2]);
        this.wallBox.add( makeWall().points[7][0], makeWall().points[7][1], makeWall().points[7][2]);
         */

        //As I was attempting to debug the collision weirdness with the first box, see above
        //I tried making a bounding box just from coordinate points I gave it, not bound to a mesh
        //However, when I went to test it I couldn't collide with this box at all,
        //It seems I couldn't find it even though I tried going right where it was.
        //This was real mysterious.
        /*
        this.wallBox.add(0, 0, -1.0);
        this.wallBox.add(0, 0, -2.0);
        this.wallBox.add(0, 1, -1.0);
        this.wallBox.add(0, 1, -2.0);
        this.wallBox.add(-1, 0, -1.0);
        this.wallBox.add(-1, 1, -1.0);
        this.wallBox.add(-1, 0, -2.0);
        this.wallBox.add(-1, 1, -2.0);
         */
    }

    /**
     * A convenience method to set all three matrices in the shader program.
     * Don't call this if you only need to set one or two matrices, instead,
     * just set it "manually" by calling gl.uniformMatrix4fv.
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {ShaderProgram} shader the shader 
     */
    setMatrices(gl, shader) {
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        gl.uniformMatrix4fv(shader.uniform('uView'), false, this.viewMatrix);
        gl.uniformMatrix4fv(shader.uniform('uProj'), false, this.projMatrix);
    }

    /**
     * Draw the Scene.  This method will be called repeatedly as often as possible.
     * 
     * @param {Number} time time in milliseconds
     * @param {WebGL2RenderingContext} gl 
     * @param {ShaderProgram} wireShader the shader to use when drawing meshes 
     * @param {ShaderProgram} flatShader the shader to use when drawing the Grid
     */
    render(time, gl, wireShader, flatShader) {
        this.pollKeys();

        // Draw the objects using wireShader
        wireShader.use(gl);
        this.setMatrices(gl, wireShader);
        this.drawScene(gl, wireShader);

        // Draw the grid using flatShader
        flatShader.use(gl);
        this.setMatrices(gl, flatShader);
        this.grid.render(gl, flatShader);

    }

    /**
     * Checks to see which keys are currently pressed, and updates the camera
     * based on the results.
     */
    pollKeys() {
        // Only do this in "play" mode.
        //Play mode also change the camera mode,
        //In play mode the camera or player cannot move up or down
        //They are stuck to the ground plane or 0 y, simulating gravity

        if( this.mode !== "play" ) return;

        if( this.controls.keyDown("KeyW")){
            //forward for dolly
            //aka negative delta
            this.camera.playerWalk(0.03);
            this.camera.getViewMatrix(this.viewMatrix);
        }

        if(this.controls.keyDown("KeyS")){
            //backward for dolly
            //aka positive delta
            this.camera.playerWalk(-0.03);
            this.camera.getViewMatrix(this.viewMatrix);

        }

        if(this.controls.keyDown("KeyA")){
            //aka left for track
            this.camera.track(-0.03, 0);
            this.camera.getViewMatrix(this.viewMatrix);
        }

        if(this.controls.keyDown("KeyD")){
            //aka right for track
            //negative
            this.camera.track(0.03, 0);
            this.camera.getViewMatrix(this.viewMatrix);
        }


        //Part of my unsuccessful collision implementation
        //Would check camera for collision every time keys were polled
        //so a players movement would not be missed.
        //Calls playerBounce in camera which was going to be where I handled
        //the collision.
        /*
        if( this.cameraAaBb.checkIntersect2Box(this.wallBox)){
            this.camera.playerBounce();
        }
         */
    }

    /**
     * Draw the objects in the scene.
     * 
     * @param {WebGL2RenderingContext} gl
     * @param {ShaderProgram} shader the shader program
     */
    drawScene(gl, shader) {

        //This is the main class and it's where all the objects are drawn for the maze
        //Including all the walls of the maze
        //Each wall is drawn individually and I manually translated and scaled each on to its
        //current place.

        //Draw the cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [3.6, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0.17, 0.5, 3.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw second cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 2.8]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-5.5, 0.5, -0.32]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw third cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [2.6, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0.12, 0.5, -7.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw fourth cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.0]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [4.0, 0.5, -0.8]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw fifth cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.5, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [1.1, 0.5, -2.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw sixth cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.0]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [11.5, 0.5, -0.95]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw seventh cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 2.5]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [15.0, 0.5, -0.5]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw eighth cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.5, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [1.45, 0.5, -12.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 9th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [3.0, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0.5, 0.5, -15.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 10th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.0]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0.3, 0.5, -2.4]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 11th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.3, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [2.5, 0.5, 0.5]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 12th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.0]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [19, 0.5, 0.7]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 13th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.4]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [15, 0.5, 1.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 14th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 3.0]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [22.0, 0.5, 0.18]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 15th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.0]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [12, 0.5, 1.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 16th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.4]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [8.0, 0.5, 1.4]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 17th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.0, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [4, 0.5, -5.1]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 18th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.4]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [18.0, 0.5, -1.3]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 19th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.0, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [4.5, 0.5, -8.5]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 20th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.0, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [4, 0.5, -12]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 21st cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 0.75]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [22.0, 0.5, -3.8]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 22nd cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.4, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [3, 0.5, -19]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 23rd cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [17.0, 0.5, -4]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 24th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 0.75]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [13.0, 0.5, -5.3]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 25th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [4, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0.13, 0.5, -18.4]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 26th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.5, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-1, 0.5, -15]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 27th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 4.3]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-9.5, 0.5, -0.2]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 28th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.6]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-11.5, 0.5, -2.3]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 29th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [3, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-0.17, 0.5, 7]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 30th cube/wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-5, 0.5, 2]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 31st wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0, 0.5, -3.6]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 32nd wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 0.75]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [8, 0.5, -6.2]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 33rd wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.3, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-2.8, 0.5, 8]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 34th wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 2.4]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-20, 0.5, 0.15]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 35th wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 2.6]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-15, 0.5, -0.15]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 36th wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-2.5, 0.5, -3]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 37th wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-2.5, 0.5, -11.5]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 38th wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-3.6, 0.5, -8]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 39th wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-20, 0.5, -2]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 40th wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-4.4, 0.5, -4]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 41st wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.5, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-2.8, 0.5, -16]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 42nd wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [2, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-1.6, 0.5, -22]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 43rd wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 0.6]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-17, 0.5, -5.7]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw the 44th wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 0.6]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-21, 0.5, -7]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);


        ////Top left zig-zag section
        //Draw 1st wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 2.3]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [20, 0.5, 1.45]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 2nd wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 2.3]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [16, 0.5, 1.65]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 3rd wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 2.3]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [12, 0.5, 1.45]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);


        ////Top Right room
        //Draw 1st wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-8, 0.5, 2.8]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 2nd wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.6, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-1.5, 0.5, 12]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw 3rd wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.2, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-3.6, 0.5, 12]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);


        ////Entrance Section
        //Draw Left side of entrance
        //Left wall one
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [2, 0.5, 3.7]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //left wall 2
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.4]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [8, 0.5, 3]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //left wall 3
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.2, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0.9, 0.5, 17]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //left wall 4
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.8, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0.87, 0.5, 21]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw Right Side of Entrance
        //Right wall 1
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-2, 0.5, 3.7]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //right wall 2
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 1.4]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-8, 0.5, 3]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //right wall 3
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [1.2, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-0.9, 0.5, 17]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //right wall 4
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.8, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-0.87, 0.5, 21]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw Center of Entrance
        //Back Wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [5.5, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0.32, 0.5, 10.5]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Intersecting wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 0.5]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0, 0.5, 4.9]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);


        ////External walls
        //Draw Horizontal cube/wall
        //Bottom Wall
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [10.0, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0.0, 0.5, -25.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Top Wall
        //Left Side
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [4.6, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0.61, 0.5, 25.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Right Side
        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [4.6, 1.0, 0.2]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-0.61, 0.5, 25.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Draw vertical cube/wall
        // Set up the transformation
        //Left Wall
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 10.0]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [25.0, 0.5, 0.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);

        //Right Wall
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.2, 1.0, 10.0]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [-25.0, 0.5, 0.0]);
        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.0, 0.8, 0.0);
        // Draw the cube
        this.cube.render(gl, shader);


        ////Fallowing are the rest of the objects in the maze that aren't walls
        ////Draw the ground plane
        if( this.groundTexture !== null) {
            ///Ground Texture
            // Bind the texture in texture channel 0
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.groundTexture);
            //// Set the uniform to texture channel zero
            gl.uniform1i(shader.uniform('worldTexture'), 0);
            // Set up the transformation
            mat4.identity(this.modelMatrix);
            mat4.scale(this.modelMatrix, this.modelMatrix, [10.0, 1.0, 10.0]);
            mat4.translate(this.modelMatrix, this.modelMatrix, [0.0, -0.5, 0.0]);
            // Set the model matrix in the shader
            gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
            // Draw the cube
            this.ground.render(gl, shader);
        }


        //This draws the Astronaut
        if(this.astroMan !== null) {
            if( this.goldTexture !== null) {
                //Gold Texture
                // Bind the texture in texture channel 0
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.goldTexture);
                //// Set the uniform to texture channel zero
                gl.uniform1i(shader.uniform('worldTexture'), 0);
                //Set up the model
                mat4.identity(this.modelMatrix);
                mat4.translate(this.modelMatrix, this.modelMatrix, [-0.5, 0, 0]);
                mat4.rotateY(this.modelMatrix, this.modelMatrix, Math.PI / 2.0 );
                mat4.scale(this.modelMatrix, this.modelMatrix, [0.0004, 0.0004, 0.0004]);
                // Set the model matrix in the shader
                gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
                // Draw the Astronaut
                this.astroMan.render(gl, shader);
            }
        }

        //This draws the tree
        if(this.tree !== null) {
            if( this.hedgeTexture !== null) {
                ///Hedge Texture
                // Bind the texture in texture channel 0
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.hedgeTexture);
                //// Set the uniform to texture channel zero
                gl.uniform1i(shader.uniform('worldTexture'), 0);
                //Set up the model
                mat4.identity(this.modelMatrix);
                mat4.translate(this.modelMatrix, this.modelMatrix, [-3.2, 0, 3.8]);
                mat4.rotateY(this.modelMatrix, this.modelMatrix, Math.PI / 2.0 * 3.2);
                mat4.scale(this.modelMatrix, this.modelMatrix, [0.08, .08, 0.08]);
                // Set the model matrix in the shader
                gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
                // Set the color in the shader
                gl.uniform3f(shader.uniform('uColor'), 12, 1, 1);
                // Draw the Astronaut
                this.tree.render(gl, shader);
            }
        }

        // Reset the model matrix to the identity
        mat4.identity(this.modelMatrix);
    }


    /**
     * Called when the canvas is resized.
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Number} width the width of the canvas in pixels 
     * @param {Number} height the height of the canvas in pixels 
     */
    resize(gl, width, height) {
        this.width = width;
        this.height = height;
        this.setProjectionMatrix();

        // Sets the viewport transformation
        gl.viewport(0, 0, width, height);
    }

    /**
     * Sets this.projMatrix to the appropriate projection matrix.
     */
    setProjectionMatrix() {

        if( this.projType === "perspective") {
            const aspect = this.width / this.height;
            mat4.perspective(this.projMatrix, glMatrix.toRadian(45.0), aspect, 0.1, 1000.0);
        }

        if( this.projType === "orthographic"){
            mat4.ortho(this.projMatrix, -(this.width/this.height), (this.width/this.height), -1,1,0.5,1000.0);
        }
    }

    /**
     * This method is called when the mouse moves while the left mouse button
     * is pressed.  This should apply either a "orbit" motion to the camera
     * or a "turn" motion depending on this.mode.
     * 
     * @param {Number} deltaX change in the mouse's x coordinate
     * @param {Number} deltaY change in the mouse's y coordinate
     */
    leftDrag( deltaX, deltaY ) { 

        if( this.mode === "mouse"){
            this.camera.orbit(deltaX*0.05,deltaY*0.05);
            this.camera.getViewMatrix(this.viewMatrix);
        }

        if( this.mode === "play"){
            this.camera.turn(deltaX*0.005,deltaY*0.005);
            this.camera.getViewMatrix(this.viewMatrix);
        }

    }

    /**
     * This method is called when the mouse moves while the left mouse button
     * is pressed and the shift key is down.  This should apply a "track" motion 
     * to the camera when in "mouse" mode.
     * 
     * @param {Number} deltaX change in the mouse's x coordinate
     * @param {Number} deltaY change in the mouse's y coordinate
     */
    shiftLeftDrag( deltaX, deltaY ) {
        if (this.controls.keyDown("ShiftLeft") && this.mode === "mouse"){

            this.camera.track(deltaX* 0.005, deltaY * 0.005);
            this.camera.getViewMatrix(this.viewMatrix);
        }

    }

    /**
     * Called when the mouse wheel is turned.
     * 
     * @param {Number} delta change amount
     */

    //called automatically when the mouse wheel is moved
    mouseWheel(delta) {
        if( this.mode === "mouse"){
            this.camera.dolly(delta*0.005);
            this.camera.getViewMatrix(this.viewMatrix);
        }
    }

    /**
     * Resets the camera to a bird's eye position and orientation. This is
     * called when the user clicks the "Birds Eye View" button.
     * Used for editing the map.
     */
    resetBirdEye() {
        // Set the camera's default position/orientation, to a birds eye view of the maze
        //Set to birds eye view for editing, and also seeing the whole maze easily
        this.camera.orient([0, 13 ,0], [0, 0,0.1], [0, 1, 0]);
        this.setMode("mouse");
        // Retrieve the new view matrix
        this.camera.getViewMatrix(this.viewMatrix);
    }

    /**
     * Resets the camera to a human pov position and orientation.  This is
     * called when the user clicks the "Play View" button.
     * This is the start orientation for the game.
     */
    resetPlayView() {
        // Set the camera's default position/orientation
        //Set to start game place, or where the player would start to play the "game"
        //This starts the player outside the entrance to the maze, as
        //the goal for the "game" is to get to the center and find the golden astronaut.
        this.camera.orient([0.0,0.7,6.0], [0,0.3,0.0], [0,1,0]);
        this.setMode("play");
        // Retrieve the new view matrix
        this.camera.getViewMatrix(this.viewMatrix);
    }

    /**
     * Set the view volume type.  This is called when the perspective/orthographic radio button
     * is changed.
     * 
     * @param {String} type projection type.  Either "perspective" or "orthographic" 
     */
    setViewVolume( type ) {
        this.projType = type;
        this.setProjectionMatrix();
    }

    /**
     * Called when the camera mode is changed.
     * 
     * @param {String} type the camera mode: either "play" or "mouse"
     */
    setMode(type) {
        this.mode = type;
    }

}