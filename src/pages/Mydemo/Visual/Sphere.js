// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useRef } from 'react'
// import store from 'store';
import { connect } from 'dva'
import * as THREE from 'three'
import html2canvas from 'html2canvas'
import CameraControls from 'camera-controls'
import { CSS2DRenderer, CSS2DObject } from 'three-css2drenderer'
import styles from './sphere.less'

CameraControls.install({ THREE })
let timer = 0
const fragment = null
const Sphere = props => {
  const { dispatch, className, ...rest } = props

  useEffect(() => {
    console.log('fff: ', THREE)
    const container = document.querySelector('#unisphere')
    const width = 700
    const height = 700
    const RADIUS = 80
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
    camera.position.set(200, 100, 10) // 设置相机位置
    camera.lookAt(scene.position) // 让相机指向原点
    // camera.lookAt(new THREE.Vector3(0, 0, 0)); // 让相机指向原点

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(new THREE.Color(0x039ef4))
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // Three.js 提供很多种辅助函数(helper)，它有助于调试
    // 创建坐标轴（RGB颜色 分别代表 XYZ轴）
    const axesHelper = new THREE.AxesHelper(10)
    axesHelper.position.y = 0
    // 将立方体网格加入到场景中
    scene.add(axesHelper)
    const CameraHelper = new THREE.CameraHelper(camera)
    scene.add(CameraHelper)

    // 自然光
    const ambientLight = new THREE.AmbientLight(0x606060)
    scene.add(ambientLight)

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(1, 0.75, 0.5).normalize()
    scene.add(directionalLight)

    const geometry = new THREE.SphereGeometry(RADIUS, 60, 60)

    const earthGeometry = new THREE.SphereBufferGeometry(RADIUS, 60, 60)

    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(width, height)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = 0
    container.appendChild(labelRenderer.domElement)

    const shpereTextEL = document.querySelector('#unisphere3')
    const controlAnimation = materialText => {
      const outerSphereMesh = new THREE.Mesh(earthGeometry, materialText)
      outerSphereMesh.position.set(10, 10, 0)
      scene.add(outerSphereMesh)

      shpereTextEL.textContent = 's泛光灯是'
      shpereTextEL.style.color = 'red'
      shpereTextEL.style.margintBottom = '-300px'
      const moonLabel = new CSS2DObject(shpereTextEL)
      moonLabel.position.set(0, RADIUS, 0)
      outerSphereMesh.add(moonLabel)

      const render2 = () => {
        renderer.render(scene, camera)
        labelRenderer.render(scene, camera)
      }
      // controls
      // snip ( init three scene... )
      const clock = new THREE.Clock()
      // const controls = new CameraControls(camera, renderer.domElement);
      const controls = new CameraControls(camera, labelRenderer.domElement)
      var animate = function () {
        // snip
        const delta = clock.getDelta()
        const hasControlsUpdated = controls.update(delta)
        controls.addEventListener('change', render2)
        controls.addEventListener('controlstart', controlstart)
        controls.addEventListener('controlend', controlend)
        controls.minDistance = 10
        controls.maxDistance = 50
        controls.enablePan = false

        controls.enableZoom = true

        timer = window.requestAnimationFrame(animate)

        // console.log('hasControlsUpdated: ', hasControlsUpdated);
        // you can skip this condition to render though
        if (!hasControlsUpdated) {
          // sphereMesh.rotation.y += 0.01;
          outerSphereMesh.rotation.y += 0.005
        }
        render2()

        // sphereMesh.rotation.x += 0.01;
        // sphereMesh.rotation.y += 0.01;
        // sphereMesh.rotation.z += 0.21;

        // renderer.render(scene, camera);
      }
      function controlstart(event) {
        console.log('eve: ', event)
        window.cancelAnimationFrame(timer)
      }
      function controlend(event) {
        console.log('eve: ', event)
        timer = window.requestAnimationFrame(animate)
      }

      animate()
    }

    new html2canvas(shpereTextEL).then(canvas => {
      const material2 = new THREE.MeshPhongMaterial({
        map: new THREE.CanvasTexture(canvas) // 设置纹理贴图
      })
      console.log('canvas-material2: ', canvas, material2)
      // const sphereMesh = new THREE.Mesh(geometry, material2);
      // sphereMesh.position.set(10, 10, 0); // 设置球的坐标
      // scene.add(sphereMesh);

      const materialText = new THREE.MeshPhongMaterial({
        map: new THREE.CanvasTexture(canvas) // 设置纹理贴图
      })
      controlAnimation(materialText)
    })
  }, [])

  const sphereText = () => {
    const textArray = [
      '执法执勤',
      'OA',
      '政法委中转服务',
      '身无云文件迁移服务',
      '金融智能平台',
      '互联网法院数据导入导出',
      'cocall聊天服务',
      '执行系统',
      'DNS域名报表',
      '宪法建议',
      '视频会议录像ftp服务',
      '质检支撑平台',
      '公告管理',
      '据法裁判文书云体验系统',
      '堡垒机数据库审计专用项目',
      '数字法庭',
      '外网庭审影音平台',
      '微软商业智能分析平台',
      '当事人画像',
      'thunderbird邮件系统',
      '嘻嘻小飞龙',
      '白岩松大卡',
      '白岩松大卡2',
      '白岩松大卡3',
      '马来西亚检测',
      '海南岛项目',
      '棱镜识别系统',
      '3d打印系统',
      '白岩松大卡5',
      '白岩松大卡6',
      '白岩松大卡7',
      '白岩松大卡8',
      '白岩松大卡9',
      '白岩松大卡22',
      '白岩松大卡33',
      '白岩松大卡44',
      '白岩松大卡55',
      'OA',
      '政法委中转服务',
      '身无云文件迁移服务',
      '金融智能平台',
      '互联网法院数据导入导出',
      'cocall聊天服务',
      '执行系统',
      'DNS域名报表',
      '宪法建议',
      '视频会议录像ftp服务',
      '质检支撑平台',
      '公告管理',
      '据法裁判文书云体验系统',
      '堡垒机数据库审计专用项目',
      '数字法庭',
      '外网庭审影音平台',
      '微软商业智能分析平台',
      '当事人画像',
      'thunderbird邮件系统',
      '嘻嘻小飞龙',
      '白岩松大卡',
      '白岩松大卡2',
      '白岩松大卡3',
      '马来西亚检测',
      '海南岛项目',
      '棱镜识别系统',
      '3d打印系统',
      '白岩松大卡5',
      '白岩松大卡6',
      '白岩松大卡7',
      '白岩松大卡8',
      '白岩松大卡9',
      '白岩松大卡22',
      '白岩松大卡33',
      '白岩松大卡44',
      '白岩松大卡55',

      'OA',
      '政法委中转服务',
      '身无云文件迁移服务',
      '金融智能平台',
      '互联网法院数据导入导出',
      'cocall聊天服务',
      '执行系统',
      'DNS域名报表',
      '宪法建议',
      '视频会议录像ftp服务',
      '质检支撑平台',
      '公告管理',
      '据法裁判文书云体验系统',
      '堡垒机数据库审计专用项目',
      '数字法庭',
      '外网庭审影音平台',
      '微软商业智能分析平台',
      '当事人画像',
      'thunderbird邮件系统',
      '嘻嘻小飞龙',
      '白岩松大卡',
      '白岩松大卡2',
      '白岩松大卡3',
      '马来西亚检测',
      '海南岛项目',
      '棱镜识别系统',
      '3d打印系统',
      '白岩松大卡5',
      '白岩松大卡6',
      '白岩松大卡7',
      '白岩松大卡8',
      '白岩松大卡9',
      '白岩松大卡22',
      '白岩松大卡33',
      '白岩松大卡44',
      '白岩松大卡55'
    ]
    return (
      <div style={{ width: 1500, height: 100 }}>
        {textArray.map(item => (
          <span style={{ display: 'inline-block', padding: '10px 20px', color: 'blue' }}>{item}</span>
        ))}
      </div>
    )
  }

  return (
    <div className={`${styles.container} ${className}`} style={{ height: '100%' }}>
      <div id="unisphere" />
      {/* <div id="unisphere3" style={{ visibility: 'hidden', position: 'absolute', zIndex: 10000 }}> */}
      <div id="unisphere3">{sphereText()}</div>
      {/* <div id="unisphere4" style={{ width: 300, height: 300 }} />
<div id="unisphere2" /> */}
    </div>
  )
}
export default connect(() => ({}))(Sphere)
