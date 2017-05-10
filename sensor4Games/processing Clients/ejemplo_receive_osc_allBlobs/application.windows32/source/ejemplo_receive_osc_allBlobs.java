import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import oscP5.*; 
import netP5.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class ejemplo_receive_osc_allBlobs extends PApplet {

/** //<>//
 * oscP5sendreceive by andreas schlegel
 * example shows how to send and receive osc messages.
 * oscP5 website at http://www.sojamo.de/oscP5
 */




OscP5 oscP5;
NetAddress myRemoteLocation;

Blob[] blobs;

PFont f;

Boolean bDebug = true;

public void setup() {
  

  //pixelDensity(2);
  //println(width, height);
  //println(pixelWidth, pixelHeight);

  frameRate(25);

  //setup OSC
  oscP5 = new OscP5(this, 12345);
  //myRemoteLocation = new NetAddress("127.0.0.1", 12345);

  // Create the font
  //printArray(PFont.list());
  f = createFont("SourceCodePro-Regular.ttf", 24);
  textFont(f);

  //first time 0 elements
  clear2NewBlobs(0);
}

//---------------------------------------
public void draw() {
  background(0);

  for (Blob auxBlob : blobs) {
    auxBlob.display(bDebug);
  }

  text("FrameRate-"+str(frameRate), 0, 10);
}

public void mousePressed() {
}

//--------------------------------------------------
//void updateTrackPath(blobs){
  
//}

//---------------------------------------------------
public void clear2NewBlobs(int numNewBlobs) {

  //TODO find if time is higher than 1s and Update path track
  //updateTrackPath(blobs);

  //blobs = new Blob[0];//Lets Reset. There is no clear funct using Array?
  blobs = new Blob[numNewBlobs];

  println("numNewBlobs="+str(numNewBlobs));
  for (int i = 0; i < numNewBlobs; i++) {
    blobs[i] = new Blob(width, height);//setting here the display proportions
  }
}

//----------------------------------------------------
public void oscEvent(OscMessage theOscMessage) {
  //Uncomment to Debug OSC messages, this prints the address pattern and the typetag of the received OscMessage
  print("### received an osc message.");
  print(" addrpattern: "+theOscMessage.addrPattern());
  println(" typetag: "+theOscMessage.typetag());

  if (theOscMessage.checkAddrPattern("/GameBlobAllIn") == true) {
    //get how many new blobs are going to be received
    int numBlobs = theOscMessage.get(0).intValue();

    //Prepare a new Array of Blobs
    clear2NewBlobs(numBlobs);

    //Read and save OSC info
    for (int i = 0; i< numBlobs; i++) {
      //if (theOscMessage.checkTypetag("ffff")) {
      float posBlobX = theOscMessage.get(1+i*4+0).floatValue(); // X position [0..1]
      float posBlobY = theOscMessage.get(1+i*4+1).floatValue();  // Y position [0..1]
      int idBlob = theOscMessage.get(1+i*4+2).intValue();
      int timeBlob = theOscMessage.get(1+i*4+3).intValue();

      println("receive["+str(i)+"] x="+str(posBlobX)+" y="+str(posBlobY));

      //Save this in the new Array of Blob
      blobs[i].xPos = posBlobX;
      blobs[i].yPos = posBlobY;
      blobs[i].id = idBlob;
      blobs[i].time = timeBlob;

      println("blobs["+str(i)+"] x="+str(blobs[i].xPos)+" y="+str(blobs[i].yPos));
    }
  }
}
class Blob {
  float xPos;
  float yPos;
  int id; 
  int time; 
  //TODO velx, vely
  int wScale, hScale;

  // Constructor
  Blob(int w, int h) {
    wScale = w;
    hScale = h;
    xPos = -1;
    yPos = -1;
    id = -1; //Id will be the order received or ID from tracking
    time = -1; //time -1 if not tracking
  }

  // Custom method for updating the variables
  public void updateOSC() {
  }

  //------------------------------
  public void displayBlobInfo() {
    fill(255);
    int gapY = 20; 
    text("id-"+str(id), xPos*wScale, yPos*hScale*1);
    text("time-"+str(time), xPos*wScale, yPos*hScale+gapY*2);
    text("x-"+str(xPos*wScale), xPos*wScale, yPos*hScale+gapY*3);
    text("y-"+str(yPos*hScale), xPos*wScale, yPos*hScale+gapY*4);
  }

  // Custom method for drawing the object
  public void display(Boolean bDebug) {

    ellipse(xPos*wScale, yPos*hScale, 6, 6);
    if (bDebug) {
      //Draw text
      textAlign(CENTER);
      displayBlobInfo();
    }
  }
}
  public void settings() {  size(800, 800); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "ejemplo_receive_osc_allBlobs" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
