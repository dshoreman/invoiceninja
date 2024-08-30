<?php

/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2024. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

namespace App\Livewire\Flow2;

use App\Exceptions\PaymentFailed;
use App\Utils\Traits\WithSecureContext;
use Livewire\Component;
use App\Libraries\MultiDB;
use App\Models\CompanyGateway;
use App\Models\InvoiceInvitation;
use App\Services\ClientPortal\LivewireInstantPayment;

class ProcessPayment extends Component
{
    use WithSecureContext;

    private ?string $payment_view;

    private array $payment_data_payload = [];

    public $isLoading = true;

    public function mount()
    {

        MultiDB::setDb($this->getContext()['db']);

        $invitation = InvoiceInvitation::find($this->getContext()['invitation_id']);

        $data = [
            'company_gateway_id' => $this->getContext()['company_gateway_id'],
            'payment_method_id' => $this->getContext()['gateway_type_id'],
            'payable_invoices' => $this->getContext()['payable_invoices'],
            'signature' => isset($this->getContext()['signature']) ? $this->getContext()['signature'] : false,
            'signature_ip' => isset($this->getContext()['signature_ip']) ? $this->getContext()['signature_ip'] : false,
            'pre_payment' => false,
            'frequency_id' => false,
            'remaining_cycles' => false,
            'is_recurring' => false,
            // 'hash' => false,
        ];

        $responder_data = (new LivewireInstantPayment($data))->run();

        $company_gateway = CompanyGateway::find($this->getContext()['company_gateway_id']);

        if (!$responder_data['success']) {
            throw new PaymentFailed($responder_data['error'], 400);
        }

        $driver = $company_gateway
            ->driver($invitation->contact->client) // @phpstan-ignore-line
            ->setPaymentMethod($data['payment_method_id'])
            ->setPaymentHash($responder_data['payload']['ph']);

        $this->payment_data_payload = $driver->processPaymentViewData($responder_data['payload']);

        $this->payment_view = $driver->livewirePaymentView(
            $this->payment_data_payload,
        );

        $this->isLoading = false;

    }

    public function render(): \Illuminate\Contracts\View\Factory|string|\Illuminate\View\View
    {
        if ($this->isLoading) {
            return <<<'HTML'
            <template></template>
        HTML;
        }

        return render($this->payment_view, $this->payment_data_payload);
    }
}