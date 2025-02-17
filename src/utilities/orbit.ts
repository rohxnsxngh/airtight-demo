import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { gsap } from "gsap";

interface Axis {
  axis: string;
  direction: THREE.Vector3;
  size: number;
  color: string[];
  line?: number;
  label?: string;
  position: THREE.Vector3;
}

class OrbitViewHelper {
  lock: boolean;
  lockX: boolean;
  lockY: boolean;

  update: () => void;
  dispose: () => void;

  domElement: HTMLCanvasElement;

  constructor(orbitControls: any, options: any, components: OBC.Components) {
    options = Object.assign(
      {
        size: 90,
        padding: 8,
        bubbleSizePrimary: 8,
        bubbleSizeSecondary: 6,
        lineWidth: 2,
        fontSize: "12px",
        fontFamily: "arial",
        fontWeight: "bold",
        fontColor: "#000000",
        fontYAdjust: 0,
        className: "obit-controls-gizmo",
        colors: {
          x: ["#FF0700", "#D52923"],
          y: ["#FFD301", "#D5B723"],
          z: ["#0008FF", "#2329D5"],
        },
      },
      options
    );

    this.lock = false;
    this.lockX = false;
    this.lockY = false;

    this.update = () => {
      if (this.lock) return;

      camera.updateMatrix();
      inverseRotationMatrix.extractRotation(camera.matrix).invert();

      for (let i = 0, length = axes.length; i < length; i++)
        setAxisPosition(axes[i], inverseRotationMatrix);

      // Sort the layers where the +Z position is last so its drawn on top of anything below it
      axes.sort((a, b) => (a.position.z > b.position.z ? 1 : -1));

      // Draw the layers
      drawLayers(true);
    };

    this.dispose = () => {
      orbit.removeEventListener("change", this.update);
      orbit.removeEventListener("start", () =>
        this.domElement.classList.add("inactive")
      );
      orbit.removeEventListener("end", () =>
        this.domElement.classList.remove("inactive")
      );

      this.domElement.removeEventListener("pointerdown", onPointerDown, false);
      this.domElement.removeEventListener(
        "pointerenter",
        onPointerEnter,
        false
      );
      this.domElement.removeEventListener("pointermove", onPointerMove, false);
      this.domElement.removeEventListener("click", onMouseClick, false);
      window.removeEventListener("pointermove", onDrag, false);
      window.removeEventListener("pointerup", onPointerUp, false);
      this.domElement.remove();
    };

    // Internals
    const scoped = this;
    const orbit = orbitControls;
    const camera = orbitControls.object;
    const inverseRotationMatrix = new THREE.Matrix4();
    const mouse = new THREE.Vector3();
    const rotateStart = new THREE.Vector2();
    const rotateEnd = new THREE.Vector2();
    const rotateDelta = new THREE.Vector2();
    const center = new THREE.Vector3(options.size / 2, options.size / 2, 0);
    const axes = createAxes();
    let selectedAxis: Axis | null = null;
    let isDragging = false;
    let context: any;
    let rect: any;
    let orbitState: any;

    orbit.addEventListener("change", this.update);
    orbit.addEventListener("start", () =>
      this.domElement.classList.add("inactive")
    );
    orbit.addEventListener("end", () =>
      this.domElement.classList.remove("inactive")
    );

    function createAxes() {
      // Generate list of axes
      const colors = options.colors;
      const line = options.lineWidth;
      const size = {
        primary: options.bubbleSizePrimary,
        secondary: options.bubbleSizeSecondary,
      };
      return [
        {
          axis: "x",
          direction: new THREE.Vector3(1, 0, 0),
          size: size.primary,
          color: colors.x,
          line,
          label: "X",
          position: new THREE.Vector3(0, 0, 0),
        },
        {
          axis: "y",
          direction: new THREE.Vector3(0, 1, 0),
          size: size.primary,
          color: colors.y,
          line,
          label: "Y",
          position: new THREE.Vector3(0, 0, 0),
        },
        {
          axis: "z",
          direction: new THREE.Vector3(0, 0, 1),
          size: size.primary,
          color: colors.z,
          line,
          label: "Z",
          position: new THREE.Vector3(0, 0, 0),
        },
        {
          axis: "-x",
          direction: new THREE.Vector3(-1, 0, 0),
          size: size.secondary,
          color: colors.x,
          position: new THREE.Vector3(0, 0, 0),
        },
        {
          axis: "-y",
          direction: new THREE.Vector3(0, -1, 0),
          size: size.secondary,
          color: colors.y,
          position: new THREE.Vector3(0, 0, 0),
        },
        {
          axis: "-z",
          direction: new THREE.Vector3(0, 0, -1),
          size: size.secondary,
          color: colors.z,
          position: new THREE.Vector3(0, 0, 0),
        },
      ];
    }

    function createCanvas() {
      const canvas = document.createElement("canvas");
      canvas.width = options.size;
      canvas.height = options.size;
      canvas.classList.add(options.className);

      canvas.addEventListener("pointerdown", onPointerDown, false);
      canvas.addEventListener("pointerenter", onPointerEnter, false);
      canvas.addEventListener("pointermove", onPointerMove, false);
      canvas.addEventListener("click", onMouseClick, false);

      context = canvas.getContext("2d");

      return canvas;
    }

    function onPointerDown(e: { clientX: number; clientY: number }) {
      rotateStart.set(e.clientX, e.clientY);
      orbitState = orbit.enabled;
      orbit.enabled = false;
      window.addEventListener("pointermove", onDrag, false);
      window.addEventListener("pointerup", onPointerUp, false);
    }

    function onPointerUp() {
      setTimeout(() => (isDragging = false), 0);
      scoped.domElement.classList.remove("dragging");
      orbit.enabled = orbitState;
      window.removeEventListener("pointermove", onDrag, false);
      window.removeEventListener("pointerup", onPointerUp, false);
    }

    function onPointerEnter() {
      rect = scoped.domElement.getBoundingClientRect();
      console.log(orbit);
    }

    function onPointerMove(
      e: { clientX: number; clientY: number } | undefined
    ) {
      if (isDragging || scoped.lock) return;

      const currentAxis = selectedAxis;

      selectedAxis = null;
      if (e) mouse.set(e.clientX - rect.left, e.clientY - rect.top, 0);

      // Loop through each layer
      for (let i = 0, length = axes.length; i < length; i++) {
        const distance = mouse.distanceTo(axes[i].position);

        if (distance < axes[i].size) selectedAxis = axes[i];
      }

      if (currentAxis !== selectedAxis) drawLayers(true);
    }

    function onDrag(e: { clientX: number; clientY: number }) {
      if (scoped.lock) return;

      if (!isDragging) scoped.domElement.classList.add("dragging");

      isDragging = true;

      selectedAxis = null;

      rotateEnd.set(e.clientX, e.clientY);

      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(0.5);

      if (!scoped.lockX)
        orbit.rotateLeft(
          (2 * Math.PI * rotateDelta.x) / scoped.domElement.height
        );

      if (!scoped.lockY)
        orbit.rotateUp(
          (2 * Math.PI * rotateDelta.y) / scoped.domElement.height
        );

      rotateStart.copy(rotateEnd);

      orbit.update();
    }

    function onMouseClick() {
      //FIXME Don't like the current animation
      console.log("orbit control clicked");
      if (isDragging || !selectedAxis) return;

      const vec = selectedAxis.direction.clone();
      const distance = camera.position.distanceTo(orbit.target);
      vec.multiplyScalar(distance);

      // Use GSAP to animate the camera's position to the target position
      //@ts-ignore
      gsap.to(components.camera.activeCamera.position, {
        duration: 1, // Adjust the duration as needed
        ease: "power1.inOut", // Adjust the easing as needed
        x: vec.x,
        y: vec.y,
        z: vec.z,
        onUpdate: () => {
          //@ts-ignore
          components.camera.controls.setLookAt(
            vec.x + 0.025,
            vec.y + 0.025,
            vec.z + 0.025,
            0,
            0,
            0
          );
        },
        onComplete: () => {
          //@ts-ignore
          components.camera.controls.enabled = true;
          //@ts-ignore
          components.camera.controls.enablePan = true;
          //@ts-ignore
          components.camera.controls.enableZoom = true;
          //@ts-ignore
          components.camera.controls.screenSpacePanning = true;
        },
      });

      selectedAxis = null;
    }

    function drawCircle(p: THREE.Vector3, radius = 10, color = "#FF0000") {
      context.beginPath();
      context.arc(p.x, p.y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.closePath();
    }

    function drawLine(
      p1: THREE.Vector3,
      p2: THREE.Vector3,
      width = 1,
      color = "#FF0000"
    ) {
      context.beginPath();
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.lineWidth = width;
      context.strokeStyle = color;
      context.stroke();
      context.closePath();
    }

    function drawLayers(clear: boolean | undefined) {
      if (clear)
        context.clearRect(
          0,
          0,
          scoped.domElement.width,
          scoped.domElement.height
        );

      // For each layer, draw the axis
      for (let i = 0, length = axes.length; i < length; i++) {
        const axis = axes[i];

        // Set the color
        const highlight = selectedAxis === axis;
        const color = axis.position.z >= -0.01 ? axis.color[0] : axis.color[1];

        // Draw the line that connects it to the center if enabled
        if (axis.line) drawLine(center, axis.position, axis.line, color);

        // Draw the circle for the axis
        drawCircle(axis.position, axis.size, highlight ? "#FFFFFF" : color);

        // Write the axis label (X,Y,Z) if provided
        if (axis.label) {
          context.font = [
            options.fontWeight,
            options.fontSize,
            options.fontFamily,
          ].join(" ");
          context.fillStyle = options.fontColor;
          context.textBaseline = "middle";
          context.textAlign = "center";
          context.fillText(
            axis.label,
            axis.position.x,
            axis.position.y + options.fontYAdjust
          );
        }
      }
    }

    function setAxisPosition(axis: any, inverseRotationMatrix: THREE.Matrix4) {
      const position = axis.direction
        .clone()
        .applyMatrix4(inverseRotationMatrix);
      const size = axis.size;
      axis.position.set(
        position.x * (center.x - size / 2 - options.padding) + center.x,
        center.y - position.y * (center.y - size / 2 - options.padding),
        position.z
      );
    }

    // Initialization
    this.domElement = createCanvas();
    this.update();
  }
}

export { OrbitViewHelper };
