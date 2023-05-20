import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CifraService } from '../cifra.service';
declare let $: any;

@Component({
  selector: 'cifra-view',
  templateUrl: './cifra.component.html',
  styleUrls: ['./cifra.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CifraViewComponent implements OnInit {
  lineHeight: number;
  fontSize: number;
  cifra: any;
  indexJson: any[] = [];
  pontoAVideo: any;
  pontoBVideo: any;
  pontos: any[] = [];
  audioTocando: any;
  scrollId: any;
  tempoScroll: any = 100;
  mostrarMenu = false;

  constructor(
    private cifraService: CifraService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    let idArtista = (this.route.snapshot.queryParams as any).artista;
    let idMusica = (this.route.snapshot.queryParams as any).musica;

    if (!idArtista) {
      this.router.navigate(['/cifras']);
      return;
    }

    // indexJsonOriginal
    let indexLocal = localStorage.getItem('indexJsonOriginal');
    this.indexJson = JSON.parse(indexLocal);

    let artista = this.indexJson.filter(x => x.id === idArtista) as any;
    this.cifra = (artista[0].musicas as any[]).filter(x => x.id === idMusica)[0];

    // cifrasBase64JsonOriginal
    let cifrasBase64 = JSON.parse(localStorage.getItem('cifrasBase64JsonOriginal')) as any[];
    let cifraBase64 = cifrasBase64.filter(x => x.id === this.cifra.cifraBase64)[0];

    document.querySelector('.cifra_cnt').innerHTML = this.b64DecodeUnicode(cifraBase64.cifraBase64);

    if (localStorage.getItem('lineHeight')) {
      this.lineHeight = Number(localStorage.getItem('lineHeight'));
    } else {
      this.lineHeight = 1.0;
      localStorage.setItem('lineHeight', this.lineHeight.toString())
    }

    document.querySelector('pre').style.lineHeight = this.lineHeight.toString();

    if (localStorage.getItem('fontSize')) {
      this.fontSize = Number(localStorage.getItem('fontSize'));
    } else {
      this.fontSize = 16;
      localStorage.setItem('fontSize', this.fontSize.toString())
    }

    document.querySelector('pre').style.fontSize = this.fontSize + 'px';

    if (!this.mobileAndTabletCheck()) {
      setInterval(() => {
        let botoesContainer = document.querySelector('.botoes-container') as any;
        let botoesContent = document.querySelector('.botoes-content') as any;

        botoesContent.style.width = botoesContainer.offsetWidth + 'px';
      }, 1000);
    }
  }

  b64DecodeUnicode(str: any) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  }

  mobileAndTabletCheck() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || (window as any).opera);
    return check;
  };

  fonteMais() {
    this.fontSize = this.fontSize + 0.5
    this.fontSize = Math.round((this.fontSize + Number.EPSILON) * 100) / 100;
    localStorage.setItem('fontSize', this.fontSize.toString())
    document.querySelector('pre').style.fontSize = this.fontSize + 'px';
  }

  fonteMenos() {
    this.fontSize = this.fontSize - 0.5
    this.fontSize = Math.round((this.fontSize + Number.EPSILON) * 100) / 100;
    localStorage.setItem('fontSize', this.fontSize.toString())
    document.querySelector('pre').style.fontSize = this.fontSize + 'px';
  }

  espacoMais() {
    this.lineHeight = this.lineHeight + 0.05
    this.lineHeight = Math.round((this.lineHeight + Number.EPSILON) * 100) / 100;
    localStorage.setItem('lineHeight', this.lineHeight.toString())
    document.querySelector('pre').style.lineHeight = this.lineHeight.toString();
  }

  espacoMenos() {
    this.lineHeight = this.lineHeight - 0.05
    this.lineHeight = Math.round((this.lineHeight + Number.EPSILON) * 100) / 100;
    localStorage.setItem('lineHeight', this.lineHeight.toString())
    document.querySelector('pre').style.lineHeight = this.lineHeight.toString();
  }

  resetar() {
    this.lineHeight = 1.0;
    localStorage.setItem('lineHeight', this.lineHeight.toString())
    document.querySelector('pre').style.lineHeight = this.lineHeight.toString();

    this.fontSize = 16;
    localStorage.setItem('fontSize', this.fontSize.toString())
    document.querySelector('pre').style.fontSize = this.fontSize + 'px';
  }


  avancarAudio(audio: any) {
    let video = document.querySelector(`#${audio.audioId}`) as HTMLVideoElement;
    video.currentTime = video.currentTime + 3;
  }

  voltarAudio(audio: any) {
    let video = document.querySelector(`#${audio.audioId}`) as HTMLVideoElement;
    video.currentTime = video.currentTime - 3;
  }

  pontoA(audio: any) {
    let video = document.querySelector(`#${audio.audioId}`) as HTMLVideoElement;
    this.pontoAVideo = video.currentTime;
  }

  pontoB(audio: any) {
    let video = document.querySelector(`#${audio.audioId}`) as HTMLVideoElement;
    this.pontoBVideo = video.currentTime;
  }

  salvarPontos(audio: any) {
    let id = 'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '');
    let ponto = { id: id, pontoA: this.pontoAVideo, pontoB: this.pontoBVideo };

    this.pontoAVideo = null;
    this.pontoBVideo = null;

    audio.pontos.push(ponto);

    this.cifraService.salvarIndexJson(this.indexJson).subscribe(res => {
      console.log(res);
    });
  }

  removerPontos(audio: any) {
    this.pontoAVideo = null;
    this.pontoBVideo = null;
  }

  tocar(audio: any, ponto: any) {
    (document.querySelector('#pontoA') as any).value = ponto.pontoA;
    (document.querySelector('#pontoB') as any).value = ponto.pontoB;
    (document.querySelector('#audioId') as any).value = audio.audioId;

    let videos = document.querySelectorAll(`video`);
    for (let i = 0; i < videos.length; i++) {
      videos[i].pause();
    }

    let video = document.querySelector(`#${audio.audioId}`) as HTMLVideoElement;
    video.currentTime = ponto.pontoA;
    video.play();

    video.removeEventListener("timeupdate", this.ontimeupdate);
    video.addEventListener("timeupdate", this.ontimeupdate);
  }

  ontimeupdate(e: any) {
    let audioId = (document.querySelector('#audioId') as any).value;
    let video = document.querySelector(`#${audioId}`) as HTMLVideoElement;

    let pontoA = (document.querySelector('#pontoA') as any).value;
    let pontoB = (document.querySelector('#pontoB') as any).value;

    if (video.currentTime >= pontoB) {
      video.currentTime = pontoA;
      video.play();
    }
  }

  parar(audio: any, ponto: any) {
    let video = document.querySelector(`#${audio.audioId}`) as HTMLVideoElement;
    video.removeEventListener("timeupdate", this.ontimeupdate);
    video.pause();
  }

  removerPonto(audio: any, ponto: any) {
    let video = document.querySelector(`#${audio.audioId}`) as HTMLVideoElement;
    video.removeEventListener("timeupdate", this.ontimeupdate);

    audio.pontos = (audio.pontos as any[])
      .filter(x => !(x.pontoA === ponto.pontoA && x.pontoB === ponto.pontoB));

    this.cifraService.salvarIndexJson(this.indexJson).subscribe(res => {
      console.log(res);
    });
  }

  videoPlay(audio: any) {
    this.audioTocando = audio;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'ArrowLeft' && this.audioTocando) {
      let video = document.querySelector(`#${this.audioTocando.audioId}`) as HTMLVideoElement;
      video.currentTime = video.currentTime - 3.5;
    }

    if (event.code === 'ArrowRight' && this.audioTocando) {
      let video = document.querySelector(`#${this.audioTocando.audioId}`) as HTMLVideoElement;
      video.currentTime = video.currentTime + 3.5;
    }

    if (event.code === 'Space') {
      event.preventDefault();
    }

    if (event.code === 'Space' && this.audioTocando) {
      let video = document.querySelector(`#${this.audioTocando.audioId}`) as HTMLVideoElement;
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  }

  scroll() {
    if (this.scrollId) {
      this.limparScroll();
      return;
    }

    this.scrollId = setInterval(() => {
      window.scrollTo(0, window.scrollY + 1)
    }, this.tempoScroll);
  }

  valueChanged(event: any) {
    this.limparScroll();
    this.scroll();
  }

  limparScroll() {
    if (this.scrollId) {
      clearInterval(this.scrollId);
      this.scrollId = null;
    }
  }
}

