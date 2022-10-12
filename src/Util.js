export const btn = "btn bg-black text-white dark:bg-green-400 dark:text-gray-900 dark:hover:bg-green-400/75 hover:bg-black/75"
export const btn2 = "btn bg-gray-300 text-black dark:bg-white dark:text-gray-900 dark:hover:bg-white/75 hover:bg-gray-500/50"
export const code = "bg-neutral-300 dark:bg-neutral-900 p-1 rounded-lg text-black dark:text-neutral-300";

export class IntervalTimer {
    constructor(name, callback, interval, maxFires = null){
      this.remaining = 0;
      this.state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed
  
      this.name = name;
      this.interval = interval; //in ms
      this.callback = callback;
      this.maxFires = maxFires;
      this.pausedTime = 0; //how long we've been paused for
  
      this.fires = 0;
    }
  
    proxyCallback(){
      if(this.maxFires != null && this.fires >= this.maxFires){
        this.stop();
        return;
      }
      this.lastTimeFired = new Date();
      this.fires++;
      this.callback();
    }
  
    start(){
      this.timerId = setInterval(() => this.proxyCallback(), this.interval);
      this.lastTimeFired = new Date();
      this.state = 1;
      this.fires = 0;
    }
  
    pause(){
      if (this.state != 1 && this.state != 3) return;
  
      this.remaining = this.interval - (new Date() - this.lastTimeFired) + this.pausedTime;
      this.lastPauseTime = new Date();
      clearInterval(this.timerId);
      clearTimeout(this.resumeId);
      this.state = 2;
    }
  
    resume(){
      if (this.state != 2) return;
  
      this.pausedTime += new Date() - this.lastPauseTime;
      this.state = 3;
      this.resumeId = setTimeout(() => this.timeoutCallback(), this.remaining);
    }

    setPausedTime(nbr) {
      if(this.state === 1) {
        this.stop()
        this.pausedTime = nbr
        this.start()
      } else {
        this.pausedTime = nbr;
      }
    }
  
    timeoutCallback(){
      if (this.state != 3) return;
  
      this.pausedTime = 0;
      this.proxyCallback();
      this.start();
    }
  
    stop(){
      if(this.state === 0) return;
  
      clearInterval(this.timerId);
      clearTimeout(this.resumeId);
      this.state = 0;
    }
  
    //set a new interval to use on the next interval loop
    setInterval(newInterval){
  
      //if we're running do a little switch-er-oo
      if(this.state == 1){
        this.pause();
        this.interval = newInterval;
        this.resume();
      }
      //if we're already stopped, idle, or paused just switch it
      else{
        this.interval = newInterval;
      }
    }
  
    setMaxFires(newMax){
      if(newMax != null && this.fires >= newMax){
        this.stop();
      }
      this.maxFires = newMax;
    }
  }