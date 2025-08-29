import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { AuthService } from '../app/services/auth.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnDestroy {
  private permissionSubscription: Subscription | null = null;
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  @Input() set hasPermission(permission: string | string[]) {
    // Clean up any existing subscription to avoid memory leaks
    if (this.permissionSubscription) {
      this.permissionSubscription.unsubscribe();
    }
    
    // Subscribe to the permissions observable
    this.permissionSubscription = this.authService.permissions$.subscribe(
      userPermissions => {
        // Check if the user has the required permission(s)
        const hasPermissions = Array.isArray(permission) 
          ? permission.some(p => userPermissions.includes(p))
          : userPermissions.includes(permission);

        // Update the view based on the result
        if (hasPermissions && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else if (!hasPermissions && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      }
    );
  }

  // A crucial step to prevent memory leaks when the component is destroyed
  ngOnDestroy(): void {
    if (this.permissionSubscription) {
      this.permissionSubscription.unsubscribe();
    }
  }
}