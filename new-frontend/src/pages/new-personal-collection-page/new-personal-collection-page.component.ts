import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreatePersonalCollectionFlowService } from './utils/create-personal-collection-flow.service';

@Component({
  selector: 'app-new-personal-collection-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './new-personal-collection-page.component.html',
  styleUrl: './new-personal-collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPersonalCollectionPageComponent implements OnDestroy {
  constructor(private readonly flowService: CreatePersonalCollectionFlowService) {}

  ngOnDestroy(): void {
    this.flowService.resetData();
  }
}
