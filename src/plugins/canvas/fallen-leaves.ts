/*
 * @LastEditTime: 2023-06-13 03:13:49
 * @Description: 背景落叶
 */

class BlossomParticle {
  velocity;
  rotation;
  position;
  euler;
  size;
  alpha;
  zKey;
  constructor() {
    this.velocity = new Array(3);
    this.rotation = new Array(3);
    this.position = new Array(3);
    this.euler = new Array(3);
    this.size = 1.0;
    this.alpha = 1.0;
    this.zKey = 0.0;
  }

  setVelocity(vx: number, vy: number, vz: number) {
    this.velocity[0] = vx;
    this.velocity[1] = vy;
    this.velocity[2] = vz;
  }

  setRotation(rx: number, ry: number, rz: number) {
    this.rotation[0] = rx;
    this.rotation[1] = ry;
    this.rotation[2] = rz;
  }
  setPosition(nx: number, ny: number, nz: number) {
    this.position[0] = nx;
    this.position[1] = ny;
    this.position[2] = nz;
  }

  setEulerAngles(rx: number, ry: number, rz: number) {
    this.euler[0] = rx;
    this.euler[1] = ry;
    this.euler[2] = rz;
  }

  setSize(s: number) {
    this.size = s;
  }

  update(dt: number) {
    this.position[0] += this.velocity[0] * dt;
    this.position[1] += this.velocity[1] * dt;
    this.position[2] += this.velocity[2] * dt;

    this.euler[0] += this.rotation[0] * dt;
    this.euler[1] += this.rotation[1] * dt;
    this.euler[2] += this.rotation[2] * dt;
  }
}

export const fallenLeavesAnimation = () => {
  const fallen_leaves_point_vsh = `
  uniform mat4 uProjection;
  uniform mat4 uModelView;
  uniform vec3 uResolution;
  uniform vec3 uOffset;
  uniform vec3 uDOF;  //x:focus distance, y:focus radius, z:max radius
  uniform vec3 uFade; //x:start distance, y:half distance, z:near fade start

  attribute vec3 aPosition;
  attribute vec3 aEuler;
  attribute vec2 aMisc; //x:size, y:fade

  varying vec3 p_position;
  varying float p_size;
  varying float p_alpha;
  varying float p_dist;

  //varying mat3 rot_Mat;
  varying vec3 normX;
  varying vec3 normY;
  varying vec3 normZ;
  varying vec3 normal;

  varying float diffuse;
  varying float specular;
  varying float r_stop;
  varying float distance_fade;

  void main(void) {
      // Projection is based on vertical angle
      vec4 pos = uModelView * vec4(aPosition + uOffset, 1.0);
      gl_Position = uProjection * pos;
      gl_PointSize = aMisc.x * uProjection[1][1] / -pos.z * uResolution.y * 0.5;

      p_position = pos.xyz;
      p_size = aMisc.x;
      p_dist = length(pos.xyz);
      p_alpha = smoothstep(0.0, 1.0, (p_dist - 0.1) / uFade.z);

      vec3 el_rsn = sin(aEuler);
      vec3 el_rcs = cos(aEuler);
      mat3 rot_x = mat3(
          1.0, 0.0, 0.0,
          0.0, el_rcs.x, el_rsn.x,
          0.0, -el_rsn.x, el_rcs.x
      );
      mat3 rot_y = mat3(
          el_rcs.y, 0.0, -el_rsn.y,
          0.0, 1.0, 0.0,
          el_rsn.y, 0.0, el_rcs.y
      );
      mat3 rot_z = mat3(
          el_rcs.z, el_rsn.z, 0.0,
          -el_rsn.z, el_rcs.z, 0.0,
          0.0, 0.0, 1.0
      );
      mat3 rot_mat = rot_x * rot_y * rot_z;
      normal = rot_mat[2];

      mat3 trr_otm = mat3(
          rot_mat[0][0], rot_mat[1][0], rot_mat[2][0],
          rot_mat[0][1], rot_mat[1][1], rot_mat[2][1],
          rot_mat[0][2], rot_mat[1][2], rot_mat[2][2]
      );
      normX = trr_otm[0];
      normY = trr_otm[1];
      normZ = trr_otm[2];

      const vec3 lit = vec3(0.6917144638660746, 0.6917144638660746, -0.20751433915982237);

      float tmp_dfs = dot(lit, normal);
      if(tmp_dfs < 0.0) {
          normal = -normal;
          tmp_dfs = dot(lit, normal);
      }
      diffuse = 0.4 + tmp_dfs;

      vec3 ey_ev = normalize(-pos.xyz);
      if(dot(ey_ev, normal) > 0.0) {
          vec3 hv = normalize(ey_ev + lit);
          specular = pow(max(dot(hv, normal), 0.0), 20.0);
      }
      else {
          specular = 0.0;
      }

      r_stop = clamp((abs(p_dist - uDOF.x) - uDOF.y) / uDOF.z, 0.0, 1.0);
      r_stop = pow(r_stop, 0.5);
      //-0.69315 = ln(0.5)
      distance_fade = min(1.0, exp((uFade.x - p_dist) * 0.69315 / uFade.y));
  }`;
  const fallen_leaves_point_fsh = `
  #ifdef GL_ES
  //precision medium_p float;
  precision high_p float;
  #endif

  uniform vec3 uDOF;  //x:focus distance, y:focus radius, z:max radius
  uniform vec3 uFade; //x:start distance, y:half distance, z:near fade start

  const vec3 fadeCol = vec3(0.08, 0.03, 0.06);

  varying vec3 p_position;
  varying float p_size;
  varying float p_alpha;
  varying float p_dist;

  //varying mat3 rot_Mat;
  varying vec3 normX;
  varying vec3 normY;
  varying vec3 normZ;
  varying vec3 normal;

  varying float diffuse;
  varying float specular;
  varying float r_stop;
  varying float distance_fade;

  float ellipse(vec2 p, vec2 o, vec2 r) {
      vec2 lp = (p - o) / r;
      return length(lp) - 1.0;
  }

  void main(void) {
      vec3 p = vec3(gl_PointCoord - vec2(0.5, 0.5), 0.0) * 2.0;
      vec3 d = vec3(0.0, 0.0, -1.0);
      float nd = normZ.z; //dot(-normZ, d);
      if(abs(nd) < 0.0001) discard;

      float np = dot(normZ, p);
      vec3 tp = p + d * np / nd;
      vec2 coord = vec2(dot(normX, tp), dot(normY, tp));

      //angle = 15 degree
      const float flw_rsn = 0.258819045102521;
      const float flw_rcs = 0.965925826289068;
      mat2 flw_rm = mat2(flw_rcs, -flw_rsn, flw_rsn, flw_rcs);
      vec2 flw_rp = vec2(abs(coord.x), coord.y) * flw_rm;

      float r;
      if(flw_rp.x < 0.0) {
          r = ellipse(flw_rp, vec2(0.065, 0.024) * 0.5, vec2(0.36, 0.96) * 0.5);
      }
      else {
          r = ellipse(flw_rp, vec2(0.065, 0.024) * 0.5, vec2(0.58, 0.96) * 0.5);
      }

      if(r > r_stop) discard;

      vec3 col = mix(vec3(1.0, 0.8, 0.75), vec3(1.0, 0.9, 0.87), r);
      float grady = mix(0.0, 1.0, pow(coord.y * 0.5 + 0.5, 0.35));
      col *= vec3(1.0, grady, grady);
      col *= mix(0.8, 1.0, pow(abs(coord.x), 0.3));
      col = col * diffuse + specular;

      col = mix(fadeCol, col, distance_fade);

      float alpha = (r_stop > 0.001)? (0.5 - r / (r_stop * 2.0)) : 1.0;
      alpha = smoothstep(0.0, 1.0, alpha) * p_alpha;

      gl_FragColor = vec4(col * 0.5, alpha);
  }`;
  const fxCommonVsh = `
  uniform vec3 uResolution;
  attribute vec2 aPosition;

  varying vec2 texCoord;
  varying vec2 screenCoord;

  void main(void) {
      gl_Position = vec4(aPosition, 0.0, 1.0);
      texCoord = aPosition.xy * 0.5 + vec2(0.5, 0.5);
      screenCoord = aPosition.xy * vec2(uResolution.z, 1.0);
  }`;
  const bgFsh = `
  #ifdef GL_ES
  //precision medium_p float;
  precision high_p float;
  #endif

  uniform vec2 uTimes;

  varying vec2 texCoord;
  varying vec2 screenCoord;

  void main(void) {
      vec3 col;
      float c;
      vec2 tmp_v = texCoord * vec2(0.8, 1.0) - vec2(0.95, 1.0);
      c = exp(-pow(length(tmp_v) * 1.8, 2.0));
      col = mix(vec3(0.02, 0.0, 0.03), vec3(0.96, 0.98, 1.0) * 1.5, c);
      gl_FragColor = vec4(col * 0.5, 1.0);
  }`;
  const fx_bright_buf_fsh = `
  #ifdef GL_ES
  //precision medium_p float;
  precision high_p float;
  #endif
  uniform sampler2D uSrc;
  uniform vec2 uDelta;

  varying vec2 texCoord;
  varying vec2 screenCoord;

  void main(void) {
      vec4 col = texture2D(uSrc, texCoord);
      gl_FragColor = vec4(col.rgb * 2.0 - vec3(0.5), 1.0);
  }`;
  const fx_dir_blur_r4_fsh = `
  #ifdef GL_ES
  //precision medium_p float;
  precision high_p float;
  #endif
  uniform sampler2D uSrc;
  uniform vec2 uDelta;
  uniform vec4 uBlurDir; //dir(x, y), stride(z, w)

  varying vec2 texCoord;
  varying vec2 screenCoord;

  void main(void) {
      vec4 col = texture2D(uSrc, texCoord);
      col = col + texture2D(uSrc, texCoord + uBlurDir.xy * uDelta);
      col = col + texture2D(uSrc, texCoord - uBlurDir.xy * uDelta);
      col = col + texture2D(uSrc, texCoord + (uBlurDir.xy + uBlurDir.zw) * uDelta);
      col = col + texture2D(uSrc, texCoord - (uBlurDir.xy + uBlurDir.zw) * uDelta);
      gl_FragColor = col / 5.0;
  }`;
  const pp_final_vsh = `
  uniform vec3 uResolution;
  attribute vec2 aPosition;
  varying vec2 texCoord;
  varying vec2 screenCoord;
  void main(void) {
      gl_Position = vec4(aPosition, 0.0, 1.0);
      texCoord = aPosition.xy * 0.5 + vec2(0.5, 0.5);
      screenCoord = aPosition.xy * vec2(uResolution.z, 1.0);
  }`;
  const pp_final_fsh = `
  #ifdef GL_ES
  //precision medium_p float;
  precision high_p float;
  #endif
  uniform sampler2D uSrc;
  uniform sampler2D uBloom;
  uniform vec2 uDelta;
  varying vec2 texCoord;
  varying vec2 screenCoord;
  void main(void) {
      vec4 src_col = texture2D(uSrc, texCoord) * 2.0;
      vec4 bloom_col = texture2D(uBloom, texCoord);
      vec4 col;
      col = src_col + bloom_col * (vec4(1.0) + src_col);
      col *= smoothstep(1.0, 0.0, pow(length((texCoord - vec2(0.5)) * 2.0), 1.2) * 0.5);
      col = pow(col, vec4(0.45454545454545)); //(1.0 / 2.2)

      gl_FragColor = vec4(col.rgb, 1.0);
      gl_FragColor.a = 1.0;
  }`;

  // Utilities
  const Vector3: any = {};
  const Matrix44: any = {};
  Vector3.create = function (x: any, y: any, z: any) {
    return { x: x, y: y, z: z };
  };
  Vector3.dot = function (v0: { x: number; y: number; z: number }, v1: { x: number; y: number; z: number }) {
    return v0.x * v1.x + v0.y * v1.y + v0.z * v1.z;
  };
  Vector3.cross = function (v: { x: number; y: number; z: number }, v0: { y: number; z: number; x: number }, v1: { z: number; y: number; x: number }) {
    v.x = v0.y * v1.z - v0.z * v1.y;
    v.y = v0.z * v1.x - v0.x * v1.z;
    v.z = v0.x * v1.y - v0.y * v1.x;
  };
  Vector3.normalize = function (v: { x: number; y: number; z: number }) {
    let l = v.x * v.x + v.y * v.y + v.z * v.z;
    if (l > 0.00001) {
      l = 1.0 / Math.sqrt(l);
      v.x *= l;
      v.y *= l;
      v.z *= l;
    }
  };
  Vector3.arrayForm = function (v: { array: any[] | Float32Array; x: number; y: number; z: number }) {
    if (v.array) {
      v.array[0] = v.x;
      v.array[1] = v.y;
      v.array[2] = v.z;
    } else {
      v.array = new Float32Array([v.x, v.y, v.z]);
    }
    return v.array;
  };
  Matrix44.createIdentity = function () {
    return new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
  };
  Matrix44.loadProjection = function (m: number[], aspect: number, v_deg: number, near: number, far: number) {
    const h = near * Math.tan(((v_deg * Math.PI) / 180.0) * 0.5) * 2.0;
    const w = h * aspect;

    m[0] = (2.0 * near) / w;
    m[1] = 0.0;
    m[2] = 0.0;
    m[3] = 0.0;

    m[4] = 0.0;
    m[5] = (2.0 * near) / h;
    m[6] = 0.0;
    m[7] = 0.0;

    m[8] = 0.0;
    m[9] = 0.0;
    m[10] = -(far + near) / (far - near);
    m[11] = -1.0;

    m[12] = 0.0;
    m[13] = 0.0;
    m[14] = (-2.0 * far * near) / (far - near);
    m[15] = 0.0;
  };
  Matrix44.loadLookAt = function (m: number[], v_pos: { x: number; y: number; z: number }, v_look: { x: number; y: number; z: number }, vup: any) {
    const front_v = Vector3.create(v_pos.x - v_look.x, v_pos.y - v_look.y, v_pos.z - v_look.z);
    Vector3.normalize(front_v);
    const side_v = Vector3.create(1.0, 0.0, 0.0);
    Vector3.cross(side_v, vup, front_v);
    Vector3.normalize(side_v);
    const top_v = Vector3.create(1.0, 0.0, 0.0);
    Vector3.cross(top_v, front_v, side_v);
    Vector3.normalize(top_v);

    m[0] = side_v.x;
    m[1] = top_v.x;
    m[2] = front_v.x;
    m[3] = 0.0;

    m[4] = side_v.y;
    m[5] = top_v.y;
    m[6] = front_v.y;
    m[7] = 0.0;

    m[8] = side_v.z;
    m[9] = top_v.z;
    m[10] = front_v.z;
    m[11] = 0.0;

    m[12] = -(v_pos.x * m[0] + v_pos.y * m[4] + v_pos.z * m[8]);
    m[13] = -(v_pos.x * m[1] + v_pos.y * m[5] + v_pos.z * m[9]);
    m[14] = -(v_pos.x * m[2] + v_pos.y * m[6] + v_pos.z * m[10]);
    m[15] = 1.0;
  };

  //
  const timeInfo: any = {
    start: 0,
    prev: 0, // Date
    delta: 0,
    elapsed: 0, // Number(sec)
  };

  //
  let gl: WebGLRenderingContext;
  const renderSpec: any = {
    width: 0,
    height: 0,
    aspect: 1,
    array: new Float32Array(3),
    halfWidth: 0,
    halfHeight: 0,
    halfArray: new Float32Array(3),
    // and some render targets. see setViewport()
  };
  renderSpec.setSize = function (w: number, h: number) {
    renderSpec.width = w;
    renderSpec.height = h;
    renderSpec.aspect = renderSpec.width / renderSpec.height;
    renderSpec.array[0] = renderSpec.width;
    renderSpec.array[1] = renderSpec.height;
    renderSpec.array[2] = renderSpec.aspect;

    renderSpec.halfWidth = Math.floor(w / 2);
    renderSpec.halfHeight = Math.floor(h / 2);
    renderSpec.halfArray[0] = renderSpec.halfWidth;
    renderSpec.halfArray[1] = renderSpec.halfHeight;
    renderSpec.halfArray[2] = renderSpec.halfWidth / renderSpec.halfHeight;
  };

  function deleteRenderTarget(rt: { frameBuffer: any; renderBuffer: any; texture: any }) {
    gl.deleteFramebuffer(rt.frameBuffer);
    gl.deleteRenderbuffer(rt.renderBuffer);
    gl.deleteTexture(rt.texture);
  }

  function createRenderTarget(w: number, h: number) {
    const ret: any = {
      width: w,
      height: h,
      sizeArray: new Float32Array([w, h, w / h]),
      dtxArray: new Float32Array([1.0 / w, 1.0 / h]),
    };
    ret.frameBuffer = gl.createFramebuffer();
    ret.renderBuffer = gl.createRenderbuffer();
    ret.texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, ret.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.bindFramebuffer(gl.FRAMEBUFFER, ret.frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ret.texture, 0);

    gl.bindRenderbuffer(gl.RENDERBUFFER, ret.renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, ret.renderBuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return ret;
  }

  function compileShader(sh_type: any, sh_src: any) {
    const ret_sh = gl.createShader(sh_type) as any;

    gl.shaderSource(ret_sh, sh_src);
    gl.compileShader(ret_sh);

    if (!gl.getShaderParameter(ret_sh, gl.COMPILE_STATUS)) {
      const err_log = gl.getShaderInfoLog(ret_sh);
      gl.deleteShader(ret_sh);
      console.error(err_log);
      return null;
    }
    return ret_sh;
  }

  function createShader(vtx_src: string, frgSrc: string, uniform_list: string | any[], attr_list: string | any[]) {
    const vsh = compileShader(gl.VERTEX_SHADER, vtx_src);
    const fsh = compileShader(gl.FRAGMENT_SHADER, frgSrc);

    if (vsh == null || fsh == null) {
      return null;
    }

    const prog = gl.createProgram() as any;
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);

    gl.deleteShader(vsh);
    gl.deleteShader(fsh);

    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const err_log = gl.getProgramInfoLog(prog);
      console.error(err_log);
      return null;
    }

    if (uniform_list) {
      prog.uniforms = {};
      for (let i = 0; i < uniform_list.length; i++) {
        prog.uniforms[uniform_list[i]] = gl.getUniformLocation(prog, uniform_list[i]);
      }
    }

    if (attr_list) {
      prog.attributes = {};
      for (let i = 0; i < attr_list.length; i++) {
        const attr = attr_list[i];
        prog.attributes[attr] = gl.getAttribLocation(prog, attr);
      }
    }

    return prog;
  }

  function homeShader(prog: any) {
    gl.useProgram(prog);
    for (const attr in prog.attributes) {
      gl.enableVertexAttribArray(prog.attributes[attr]);
    }
  }

  function unHomeShader(prog: any) {
    for (const attr in prog.attributes) {
      gl.disableVertexAttribArray(prog.attributes[attr]);
    }
    gl.useProgram(null);
  }

  /////
  const projection = {
    angle: 60,
    near_far: new Float32Array([0.1, 100.0]),
    matrix: Matrix44.createIdentity(),
  };
  const camera = {
    position: Vector3.create(0, 0, 100),
    look_at: Vector3.create(0, 0, 0),
    up: Vector3.create(0, 1, 0),
    dof: Vector3.create(10.0, 4.0, 8.0),
    matrix: Matrix44.createIdentity(),
  };

  const pointFlower: any = {};
  // var meshFlower = {};
  let sceneStandBy = false;

  function createPointFlowers() {
    // get point sizes
    const prm = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
    renderSpec.pointSize = { min: prm[0], max: prm[1] };

    const vtx_src = fallen_leaves_point_vsh;
    const frgSrc = fallen_leaves_point_fsh;

    pointFlower.program = createShader(
      vtx_src,
      frgSrc,
      ['uProjection', 'uModelView', 'uResolution', 'uOffset', 'uDOF', 'uFade'],
      ['aPosition', 'aEuler', 'aMisc']
    );

    homeShader(pointFlower.program);
    pointFlower.offset = new Float32Array([0.0, 0.0, 0.0]);
    pointFlower.fader = Vector3.create(0.0, 10.0, 0.0);

    pointFlower.numFlowers = 1600;
    pointFlower.particles = new Array(pointFlower.numFlowers);
    // vertex attributes {position[3], euler_xyz[3], size[1]}
    pointFlower.dataArray = new Float32Array(pointFlower.numFlowers * (3 + 3 + 2));
    pointFlower.positionArrayOffset = 0;
    pointFlower.eulerArrayOffset = pointFlower.numFlowers * 3;
    pointFlower.miscArrayOffset = pointFlower.numFlowers * 6;

    pointFlower.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    unHomeShader(pointFlower.program);

    for (let i = 0; i < pointFlower.numFlowers; i++) {
      pointFlower.particles[i] = new BlossomParticle();
    }
  }

  function initPointFlowers() {
    //area
    pointFlower.area = Vector3.create(20.0, 20.0, 20.0);
    pointFlower.area.x = pointFlower.area.y * renderSpec.aspect;

    pointFlower.fader.x = 10.0; //env fade start
    pointFlower.fader.y = pointFlower.area.z; //env fade half
    pointFlower.fader.z = 0.1; //near fade start

    //particles
    const PI2 = Math.PI * 2.0;
    const tmpV3 = Vector3.create(0, 0, 0);
    let tmp_v = 0;
    const symmetryRand = function () {
      return Math.random() * 2.0 - 1.0;
    };
    for (let i = 0; i < pointFlower.numFlowers; i++) {
      const tmpPrTcl = pointFlower.particles[i];

      //velocity
      tmpV3.x = symmetryRand() * 0.3 + 0.8;
      tmpV3.y = symmetryRand() * 0.2 - 1.0;
      tmpV3.z = symmetryRand() * 0.3 + 0.5;
      Vector3.normalize(tmpV3);
      tmp_v = 2.0 + Math.random() * 1.0;
      tmpPrTcl.setVelocity(tmpV3.x * tmp_v, tmpV3.y * tmp_v, tmpV3.z * tmp_v);

      //rotation
      tmpPrTcl.setRotation(symmetryRand() * PI2 * 0.5, symmetryRand() * PI2 * 0.5, symmetryRand() * PI2 * 0.5);

      //position
      tmpPrTcl.setPosition(symmetryRand() * pointFlower.area.x, symmetryRand() * pointFlower.area.y, symmetryRand() * pointFlower.area.z);

      //euler
      tmpPrTcl.setEulerAngles(Math.random() * Math.PI * 2.0, Math.random() * Math.PI * 2.0, Math.random() * Math.PI * 2.0);

      //size
      tmpPrTcl.setSize(0.9 + Math.random() * 0.1);
    }
  }

  function renderPointFlowers() {
    //update
    const PI2 = Math.PI * 2.0;
    // var limit = [pointFlower.area.x, pointFlower.area.y, pointFlower.area.z];
    const repeatPos = function (prt: { position: { [x: string]: number }; size: number }, cmp: number, limit: number) {
      if (Math.abs(prt.position[cmp]) - prt.size * 0.5 > limit) {
        //out of area
        if (prt.position[cmp] > 0) {
          prt.position[cmp] -= limit * 2.0;
        } else {
          prt.position[cmp] += limit * 2.0;
        }
      }
    };
    const repeatEuler = function (prt: { euler: { [x: string]: number } }, cmp: number) {
      prt.euler[cmp] = prt.euler[cmp] % PI2;
      if (prt.euler[cmp] < 0.0) {
        prt.euler[cmp] += PI2;
      }
    };

    for (let i = 0; i < pointFlower.numFlowers; i++) {
      const prTcl = pointFlower.particles[i];
      prTcl.update(timeInfo.delta, timeInfo.elapsed);
      repeatPos(prTcl, 0, pointFlower.area.x);
      repeatPos(prTcl, 1, pointFlower.area.y);
      repeatPos(prTcl, 2, pointFlower.area.z);
      repeatEuler(prTcl, 0);
      repeatEuler(prTcl, 1);
      repeatEuler(prTcl, 2);

      prTcl.alpha = 1.0; //(pointFlower.area.z - prTcl.position[2]) * 0.5;

      prTcl.zKey = camera.matrix[2] * prTcl.position[0] + camera.matrix[6] * prTcl.position[1] + camera.matrix[10] * prTcl.position[2] + camera.matrix[14];
    }

    // sort
    pointFlower.particles.sort(function (p0: { zKey: number }, p1: { zKey: number }) {
      return p0.zKey - p1.zKey;
    });

    // update data
    let ipOs = pointFlower.positionArrayOffset;
    let ieuLer = pointFlower.eulerArrayOffset;
    let imIsc = pointFlower.miscArrayOffset;
    for (let i = 0; i < pointFlower.numFlowers; i++) {
      const prTcl = pointFlower.particles[i];
      pointFlower.dataArray[ipOs] = prTcl.position[0];
      pointFlower.dataArray[ipOs + 1] = prTcl.position[1];
      pointFlower.dataArray[ipOs + 2] = prTcl.position[2];
      ipOs += 3;
      pointFlower.dataArray[ieuLer] = prTcl.euler[0];
      pointFlower.dataArray[ieuLer + 1] = prTcl.euler[1];
      pointFlower.dataArray[ieuLer + 2] = prTcl.euler[2];
      ieuLer += 3;
      pointFlower.dataArray[imIsc] = prTcl.size;
      pointFlower.dataArray[imIsc + 1] = prTcl.alpha;
      imIsc += 2;
    }

    //draw
    gl.enable(gl.BLEND);
    //gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const prog = pointFlower.program;
    homeShader(prog);

    gl.uniformMatrix4fv(prog.uniforms.uProjection, false, projection.matrix);
    gl.uniformMatrix4fv(prog.uniforms.uModelView, false, camera.matrix);
    gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);
    gl.uniform3fv(prog.uniforms.uDOF, Vector3.arrayForm(camera.dof));
    gl.uniform3fv(prog.uniforms.uFade, Vector3.arrayForm(pointFlower.fader));

    gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(prog.attributes.aPosition, 3, gl.FLOAT, false, 0, pointFlower.positionArrayOffset * Float32Array.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(prog.attributes.aEuler, 3, gl.FLOAT, false, 0, pointFlower.eulerArrayOffset * Float32Array.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(prog.attributes.aMisc, 2, gl.FLOAT, false, 0, pointFlower.miscArrayOffset * Float32Array.BYTES_PER_ELEMENT);

    // doubler
    for (let i = 1; i < 2; i++) {
      const zpOs = i * -2.0;
      pointFlower.offset[0] = pointFlower.area.x * -1.0;
      pointFlower.offset[1] = pointFlower.area.y * -1.0;
      pointFlower.offset[2] = pointFlower.area.z * zpOs;
      gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
      gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers);

      pointFlower.offset[0] = pointFlower.area.x * -1.0;
      pointFlower.offset[1] = pointFlower.area.y * 1.0;
      pointFlower.offset[2] = pointFlower.area.z * zpOs;
      gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
      gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers);

      pointFlower.offset[0] = pointFlower.area.x * 1.0;
      pointFlower.offset[1] = pointFlower.area.y * -1.0;
      pointFlower.offset[2] = pointFlower.area.z * zpOs;
      gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
      gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers);

      pointFlower.offset[0] = pointFlower.area.x * 1.0;
      pointFlower.offset[1] = pointFlower.area.y * 1.0;
      pointFlower.offset[2] = pointFlower.area.z * zpOs;
      gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
      gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers);
    }

    //main
    pointFlower.offset[0] = 0.0;
    pointFlower.offset[1] = 0.0;
    pointFlower.offset[2] = 0.0;
    gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
    gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    unHomeShader(prog);

    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
  }

  // effects
  //common util
  function createEffectProgram(vtx_src: string, frgSrc: string, exUnIfs: ConcatArray<string> | null, exAttrs: ConcatArray<string> | null) {
    const ret: any = {};
    let unIfs = ['uResolution', 'uSrc', 'uDelta'];
    if (exUnIfs) {
      unIfs = unIfs.concat(exUnIfs);
    }
    let attrs = ['aPosition'];
    if (exAttrs) {
      attrs = attrs.concat(exAttrs);
    }

    ret.program = createShader(vtx_src, frgSrc, unIfs, attrs);
    homeShader(ret.program);

    ret.dataArray = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]);
    ret.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ret.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, ret.dataArray, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    unHomeShader(ret.program);

    return ret;
  }

  function homeEffect(fxObj: { program: any }, srcTex: { dtxArray: any; texture: any } | null) {
    const prog = fxObj.program;
    homeShader(prog);
    gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);

    if (srcTex != null) {
      gl.uniform2fv(prog.uniforms.uDelta, srcTex.dtxArray);
      gl.uniform1i(prog.uniforms.uSrc, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srcTex.texture);
    }
  }
  function drawEffect(fxObj: { buffer: any; program: { attributes: { aPosition: any } } }) {
    gl.bindBuffer(gl.ARRAY_BUFFER, fxObj.buffer);
    gl.vertexAttribPointer(fxObj.program.attributes.aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function unHomeEffect(fxObj: { program: any }) {
    unHomeShader(fxObj.program);
  }

  const effectLib: any = {};
  function createEffectLib() {
    let frgSrc;
    //common
    const cmnVtxSrc = fxCommonVsh;

    //background
    frgSrc = bgFsh;
    effectLib.sceneBg = createEffectProgram(cmnVtxSrc, frgSrc, ['uTimes'], null);

    frgSrc = fx_bright_buf_fsh;
    effectLib.mkBrightBuf = createEffectProgram(cmnVtxSrc, frgSrc, null, null);

    // direction blur
    frgSrc = fx_dir_blur_r4_fsh;
    effectLib.dirBlur = createEffectProgram(cmnVtxSrc, frgSrc, ['uBlurDir'], null);

    //final composite
    const vtx_src = pp_final_vsh;
    frgSrc = pp_final_fsh;
    // console.log('frgSrc :',frgSrc )
    effectLib.finalComp = createEffectProgram(vtx_src, frgSrc, ['uBloom'], null);
  }

  // background
  function createBackground() {
    //console.log("create background");
  }
  function initBackground() {
    //console.log("init background");
  }
  function renderBackground() {
    gl.disable(gl.DEPTH_TEST);

    homeEffect(effectLib.sceneBg, null);
    gl.uniform2f(effectLib.sceneBg.program.uniforms.uTimes, timeInfo.elapsed, timeInfo.delta);
    drawEffect(effectLib.sceneBg);
    unHomeEffect(effectLib.sceneBg);

    gl.enable(gl.DEPTH_TEST);
  }

  // post process
  // var postProcess = {};
  function createPostProcess() {
    //console.log("create post process");
  }
  function initPostProcess() {
    //console.log("init post process");
  }

  function renderPostProcess() {
    gl.enable(gl.TEXTURE_2D);
    gl.disable(gl.DEPTH_TEST);
    const bindRT = function (rt: { frameBuffer: any; width: any; height: any }, isClear: boolean) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, rt.frameBuffer);
      gl.viewport(0, 0, rt.width, rt.height);
      if (isClear) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      }
    };

    //make bright buff
    bindRT(renderSpec.wHalfRT0, true);
    homeEffect(effectLib.mkBrightBuf, renderSpec.mainRT);
    drawEffect(effectLib.mkBrightBuf);
    unHomeEffect(effectLib.mkBrightBuf);

    // make bloom
    for (let i = 0; i < 2; i++) {
      const p = 1.5 + 1 * i;
      const s = 2.0 + 1 * i;
      bindRT(renderSpec.wHalfRT1, true);
      homeEffect(effectLib.dirBlur, renderSpec.wHalfRT0);
      gl.uniform4f(effectLib.dirBlur.program.uniforms.uBlurDir, p, 0.0, s, 0.0);
      drawEffect(effectLib.dirBlur);
      unHomeEffect(effectLib.dirBlur);

      bindRT(renderSpec.wHalfRT0, true);
      homeEffect(effectLib.dirBlur, renderSpec.wHalfRT1);
      gl.uniform4f(effectLib.dirBlur.program.uniforms.uBlurDir, 0.0, p, 0.0, s);
      drawEffect(effectLib.dirBlur);
      unHomeEffect(effectLib.dirBlur);
    }

    //display
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, renderSpec.width, renderSpec.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    homeEffect(effectLib.finalComp, renderSpec.mainRT);
    gl.uniform1i(effectLib.finalComp.program.uniforms.uBloom, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, renderSpec.wHalfRT0.texture);
    drawEffect(effectLib.finalComp);
    unHomeEffect(effectLib.finalComp);

    gl.enable(gl.DEPTH_TEST);
  }

  /////
  // var SceneEnv = {};
  function createScene() {
    createEffectLib();
    createBackground();
    createPointFlowers();
    createPostProcess();
    sceneStandBy = true;
  }

  function initScene() {
    initBackground();
    initPointFlowers();
    initPostProcess();

    //camera.position.z = 17.320508;
    camera.position.z = pointFlower.area.z + projection.near_far[0];
    projection.angle = ((Math.atan2(pointFlower.area.y, camera.position.z + pointFlower.area.z) * 180.0) / Math.PI) * 2.0;
    Matrix44.loadProjection(projection.matrix, renderSpec.aspect, projection.angle, projection.near_far[0], projection.near_far[1]);
  }

  function renderScene() {
    //draw
    Matrix44.loadLookAt(camera.matrix, camera.position, camera.look_at, camera.up);

    gl.enable(gl.DEPTH_TEST);

    //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderSpec.mainRT.frameBuffer);
    gl.viewport(0, 0, renderSpec.mainRT.width, renderSpec.mainRT.height);
    gl.clearColor(0.005, 0, 0.05, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    renderBackground();
    renderPointFlowers();
    renderPostProcess();
  }

  /////
  function onResize() {
    makeCanvasFullScreen(document.getElementById('fallenLeaves') as HTMLCanvasElement);
    setViewPorts();
    if (sceneStandBy) {
      initScene();
    }
  }

  function setViewPorts() {
    renderSpec.setSize(gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.2, 0.2, 0.5, 1.0);
    gl.viewport(0, 0, renderSpec.width, renderSpec.height);

    const rtFunc = function (rtName: string, rtw: number, rth: number) {
      const rt = renderSpec[rtName];
      if (rt) deleteRenderTarget(rt);
      renderSpec[rtName] = createRenderTarget(rtw, rth);
    };
    rtFunc('mainRT', renderSpec.width, renderSpec.height);
    rtFunc('wFullRT0', renderSpec.width, renderSpec.height);
    rtFunc('wFullRT1', renderSpec.width, renderSpec.height);
    rtFunc('wHalfRT0', renderSpec.halfWidth, renderSpec.halfHeight);
    rtFunc('wHalfRT1', renderSpec.halfWidth, renderSpec.halfHeight);
  }

  function render() {
    renderScene();
  }

  const animating = true;
  // function toggleAnimation(elm) {
  //   animating ^= true;
  //   if (animating) animate();
  //   if (elm) {
  //     elm.innerHTML = animating ? 'Stop' : 'Start';
  //   }
  // }

  // function stepAnimation() {
  //   if (!animating) animate();
  // }

  function animate() {
    const curDate = new Date().getTime();
    timeInfo.elapsed = (curDate - timeInfo.start) / 1000.0;
    timeInfo.delta = (curDate - timeInfo.prev) / 1000.0;
    timeInfo.prev = curDate;

    if (animating) requestAnimationFrame(animate);
    render();
  }

  function makeCanvasFullScreen(canvas: HTMLCanvasElement) {
    const b = document.body;
    const d = document.documentElement;
    const fullW = Math.max(b.clientWidth, b.scrollWidth, d.scrollWidth, d.clientWidth);
    const fullH = Math.max(b.clientHeight, b.scrollHeight, d.scrollHeight, d.clientHeight);
    canvas.width = fullW;
    canvas.height = fullH;
  }

  const canvas = document.getElementById('fallenLeaves') as HTMLCanvasElement;
  try {
    makeCanvasFullScreen(canvas);
    gl = canvas.getContext('webgl') as WebGLRenderingContext;
  } catch (e) {
    console.error('WebGL 设置出错.' + e);
    console.error(e);
    return;
  }

  window.addEventListener('resize', onResize);

  setViewPorts();
  createScene();
  initScene();

  timeInfo.start = new Date();
  timeInfo.prev = timeInfo.start;
  animate();

  //set window.requestAnimationFrame
  (function (window: browserWindow & typeof globalThis) {
    const customRequestAnimationFrame = (callback: () => void) => {
      setTimeout(callback, 1000 / 60);
    };
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      customRequestAnimationFrame
    );
  })(window);
};
