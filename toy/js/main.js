let Input = {
    mouseX: 0,
    mouseY: 0,
    mouseTargetX: 0,
    mouseTargetY: 0,
    mouseDown: false,
}

function distance(pos1, pos2) {
    return Math.sqrt((pos1.x-pos2.x)**2 + (pos1.y-pos2.y)**2)
}



class Game {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id)
        this.paint = this.canvas.getContext('2d')
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.colors = []
        this.point =  new Pointer(this, "./img/cursor-pointer.png")

        this.shapes = []
        this.ticks = 0;
        let self = this

        this.paint.fillStyle = "white"
        this.paint.strokeStyle = "black"

        window.addEventListener('mousedown', event => {
            Input.mouseDown = true
        })

    

        window.addEventListener('mousemove', event => {
            Input.mouseTargetX = event.clientX
            Input.mouseTargetY = event.clientY
            Input.mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
            Input.mouseY = event.clientY - this.canvas.getBoundingClientRect().top;
        })

        setInterval(() => {
            self.update.call(self)
        }, 33);
    }

    update() {
        this.paint.save()
        this.paint.fillStyle = "black"
        this.paint.fillRect(0, 0, this.width, this.height)
        this.paint.restore()


        for (let shape of this.shapes) {
            shape.draw(this.paint)
        }

        this.point.draw(this.paint)

        // for (let shape of this.shapes) {
        //     let sr = shape.safeRange()
        //     this.paint.beginPath()
        //     this.paint.arc(sr.x, sr.y, sr.r, 0 ,360)
        //     this.paint.closePath()
        //     this.paint.stroke()
        // }
    }

    addChild(child) {
        let self = this
        this.shapes.push(child)
        child.register(() => {
            self.ticks += 1
            console.log(self.ticks,":",self.shapes.length)
            if (self.ticks >= self.shapes.length) {
                for (let shape of this.shapes) {
                    shape.play()
                }
            }
        })
    }

    collisions(elem) {
        let elem_safeRange = elem.safeRange()
        for (let shape of this.shapes) {
            let s = shape.safeRange()
            let dist = distance(elem_safeRange, shape)
            if (dist < elem_safeRange.r + s.r) {
                return true
        }
        }

        return false
    }
}


class Shape {
    constructor(x, y, deg, w, h) {
        this.child = null
        this.x = x
        this.y = y
        this.w = w != undefined ? w : 40
        this.h = h != undefined ? h : 40
        this.fillStyle = "white"
        this.deg = deg

        this.index = 0
        this.observers = []
        this.is_click = false
        this.init()
    }

    init() {

    }

    rotate(p, deg) {
        p.translate(this.x + this.w/2,this.y + this.h/2)
        p.rotate(deg)
        p.translate(-(this.x + this.w/2),-(this.y + this.h/2))
    }

    draw_path(p) {
        p.beginPath()
        this.draw_img(p)
        p.closePath()
    }

    draw(p) {
        this.animate && this.animate()
        p.save()
        p.fillStyle = this.fillStyle
        this.rotate(p, this.deg)
        this.draw_path(p)
        p.stroke()
        p.fill()
        p.restore()
        this.collision(p)
    }

    play() {
        this.animate = function () {
            this.x += Shape.Steps[this.index % 8]
            this.index++
        }
    }



    collision(p) {
        if (this.is_click==false && Input.mouseDown && p.isPointInPath(Input.mouseX, Input.mouseY)) {
            this.is_click = true
            this.fillStyle = Shape.colors[parseInt(Math.random() * Shape.colors.length)]
            this.on()
        }
    }

    register(observer) {
        this.observers.push(observer)
    }

    on() {
        for (let observer of this.observers) {
            observer && observer()
        }
    }

    safeRange() {
        return {
            x: 0,
            y: 0,
            r: 0,
        }
    }
}

Shape.Steps = [-1,-1,-1,-1,1,1,1,1]
Shape.colors = ['#FF6666', '#10C8CD', '#FA6121', '#7DC24B', '#663366', '#FFCC66', '#666666',]
//正方形
class Rect extends Shape{
    draw_img(p) {
        p.rect(this.x,this.y,this.w,this.h)
    }

    safeRange() {
        let r = (this.w > this.h ? this.w : this.h)/2
        return {
            x: this.x + this.w/2,
            y: this.y + this.h/2,
            r: r
        }
    }
}

class Circle extends Shape{
    constructor(x, y, r) {
        super(x, y, 0)
        this.r = r
    }

    draw_img(p) {
        p.arc(this.x,this.y, this.r, 0,360)
        let safe = this.safeRange()
        p.arc(safe.x, safe.y, safe.r, 0, 360)
    }

    safeRange() {
        return {
            x: this.x,
            y: this.y,
            r: this.r
        }
    }
}


class Strip extends Rect {
    constructor(x, y, deg, w) {
        super(x, y, deg, w, w/6)
    }

    draw_img(p) {
        super.draw_img(p)
    }
}

class Triangle extends Shape {

    draw_img(p) {
        let halfW = this.w/2
        p.moveTo(this.x, this.y)
        p.lineTo(this.x + this.w, this.y)
        p.lineTo(this.x, this.y + this.h)

    }

    safeRange() {
        let r = (this.w > this.h ? this.w : this.h)/2
        return {
            x: this.x + this.w/2,
            y: this.y + this.h/2,
            r: r
        }
    }
}

class Wave extends Shape {
    draw_img(p) {

        let halfW = this.w/2
        let halfH = this.h/2
        let x = this.x
        let y = this.y + halfH

        p.moveTo(x,y);
        p.quadraticCurveTo(x+ halfW/2, y - halfH, x + halfW, y-halfH/6)
        x += halfW
        p.quadraticCurveTo(x+ halfW/2, y - halfH, x + halfW, y)
        x += halfW
        p.quadraticCurveTo(x, y, x, y + halfH)
        y += halfH
        p.quadraticCurveTo(x- halfW/2, y - halfH, x - halfW, y)
        x -= halfW
        p.quadraticCurveTo(x- halfW/2, y - halfH, x - halfW, y)
    }

    safeRange() {
        let r = (this.w > this.h ? this.w : this.h)/2
        return {
            x: this.x + this.w/2,
            y: this.y + this.h/2,
            r: r
        }
    }
}

class Pointer {
    constructor(game, img_src) {
        let self = this
        this.img = new Image()
        this.img.src = img_src

    }
    draw(p) {
        p.drawImage(this.img, Input.mouseX, Input.mouseY, 32, 32)
    }

    safeRange() {
        return {
            x: this.x,
            y: this.y,
            r: this.r
        }
    }
}
