import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { CreatePersonalCollectionFlowService } from '../../create-personal-collection-flow.service';

@Component({
  selector: 'app-confirm-step',
  standalone: true,
  imports: [TuiButtonModule, TuiIslandModule],
  templateUrl: './confirm-step.component.html',
  styleUrl: './confirm-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmStepComponent {
  constructor(private readonly flowService: CreatePersonalCollectionFlowService) {}

  handleConfirm() {
    console.log(this.flowService.newPersonalCollectionData);
  }
}
