import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BannerComponent } from './components/banner/banner.component'
import { ButtonModule } from 'primeng/button'
import { ImageModule } from 'primeng/image'

@NgModule({
  imports: [CommonModule, ButtonModule, ImageModule],
  declarations: [BannerComponent],
  exports: [BannerComponent],
})
export class UiModule {}
