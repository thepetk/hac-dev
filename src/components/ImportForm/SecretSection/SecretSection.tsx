import React from 'react';
import { FormGroup, TextInputTypes, Button, GridItem, Grid } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { useFormikContext } from 'formik';
import { useRemoteSecrets } from '../../../hooks/UseRemoteSecrets';
import { InputField, TextColumnField } from '../../../shared';
import { useModalLauncher } from '../../modal/ModalProvider';
import { SecretModalLauncher } from '../../Secrets/SecretModalLauncher';
import { getSupportedPartnerTaskSecrets } from '../../Secrets/utils/secret-utils';
import { ImportFormValues } from '../utils/types';

const SecretSection = () => {
  const showModal = useModalLauncher();
  const { values, setFieldValue } = useFormikContext<ImportFormValues>();

  const [remoteSecrets, remoteSecretsLoaded] = useRemoteSecrets(values.namespace);

  const partnerTaskNames = getSupportedPartnerTaskSecrets().map(({ label }) => label);
  const partnerTaskSecrets: string[] =
    remoteSecrets && remoteSecretsLoaded
      ? remoteSecrets
          ?.filter((rs) => partnerTaskNames.includes(rs.metadata.name))
          ?.map((s) => s.metadata.name) || []
      : [];

  const onSubmit = React.useCallback(
    (secretValue: any) => {
      const secrets = [...values.importSecrets, secretValue];
      const secretNames = [...values.newSecrets, secretValue.secretName];
      setFieldValue('importSecrets', secrets);
      setFieldValue('newSecrets', secretNames);
    },
    [values, setFieldValue],
  );

  return (
    <FormGroup>
      <TextColumnField
        name="newSecrets"
        label="Secrets"
        addLabel="Add secret"
        placeholder="Secret"
        helpText="Keep your data secure with a build-time secret."
        noFooter
        isReadOnly
        onChange={(v) =>
          setFieldValue(
            'importSecrets',
            values.importSecrets.filter((vs) => v.includes(vs.secretName)),
          )
        }
      >
        {(props) => {
          return (
            <Grid>
              <GridItem span={6}>
                <InputField name={props.name} type={TextInputTypes.text} isDisabled />
              </GridItem>
              <GridItem span={6}>{props.removeButton}</GridItem>
            </Grid>
          );
        }}
      </TextColumnField>
      <Button
        isInline
        type="button"
        variant="link"
        data-testid="add-secret-button"
        icon={<PlusCircleIcon />}
        onClick={() =>
          showModal(SecretModalLauncher([...partnerTaskSecrets, ...values.newSecrets], onSubmit))
        }
      >
        Add secret
      </Button>
    </FormGroup>
  );
};
export default SecretSection;
