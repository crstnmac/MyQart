import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BannerComponent } from './components/banner/banner.component'
import { ButtonModule } from 'primeng/button'
import { ImageModule } from 'primeng/image';
import { GalleryComponent } from './components/gallery/gallery.component'

@NgModule({
  imports: [CommonModule, ButtonModule, ImageModule],
  declarations: [BannerComponent, GalleryComponent],
  exports: [BannerComponent, GalleryComponent],
})
export class UiModule {}
