import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/components/footer/footer';
import { Spinner } from './shared/components/spinner/spinner';
import { CommonModule } from '@angular/common';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('E-Commerce-App');

  showButton: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = (window.scrollY || document.documentElement.scrollTop) > 400;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
