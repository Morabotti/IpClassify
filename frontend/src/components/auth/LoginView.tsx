import { Text } from '@components/common';
import { useLogin } from '@hooks';
import { Box, Button, Card, CircularProgress, FormControl, FormLabel, Stack, TextField } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { createSx } from '@theme';
import { LoginRequest } from '@types';

const sx = createSx({
  container: {
    padding: 2,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    gap: 2
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  card: {
    padding: 2,
    maxWidth: 500,
    width: '100%'
  }
});

export const LoginView = () => {
  const { error, loading, onSubmit } = useLogin();

  const form = useForm<LoginRequest>({
    defaultValues: {
      username: '',
      password: ''
    },
    onSubmit: ({ value }) => onSubmit(value)
  });

  return (
    <Stack sx={sx.container} direction='column' justifyContent='space-between'>
      <Card sx={sx.card} variant='outlined'>
        <Text
          component='h1'
          variant='h2'
          color='primary'
          textAlign='center'
        >
          IPClassify
        </Text>
        <Text
          component='h2'
          variant='h4'
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          gutterBottom
          textAlign='center'
        >
          Login
        </Text>
        <Box
          component='form'
          onSubmit={form.handleSubmit}
          sx={sx.form}
        >
          <form.Field
            name='username'
            children={(field) => (
              <FormControl disabled={loading}>
                <FormLabel htmlFor={field.name}>Username</FormLabel>
                <TextField
                  autoComplete='username'
                  name={field.name}
                  value={field.state.value}
                  required
                  fullWidth
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={!!field.state.meta.errors?.length || error}
                  color={(field.state.meta.errors?.length || error) ? 'error' : 'primary'}
                />
              </FormControl>
            )}
          />
          <form.Field
            name='password'
            children={(field) => (
              <FormControl disabled={loading}>
                <FormLabel htmlFor={field.name}>Password</FormLabel>
                <TextField
                  autoComplete='password'
                  name={field.name}
                  value={field.state.value}
                  required
                  fullWidth
                  type='password'
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={!!field.state.meta.errors?.length || error}
                  color={(field.state.meta.errors?.length || error) ? 'error' : 'primary'}
                />
              </FormControl>
            )}
          />
          <Button
            type='button'
            fullWidth
            color='secondary'
            variant='contained'
            disabled={loading}
            onClick={form.handleSubmit}
          >
            {loading ? (
              <CircularProgress color='inherit' size={24} />
            ) : 'Login'}
          </Button>
        </Box>
      </Card>
      <Box>
        <Text variant='body2' color='textSecondary'>Demo reactive application</Text>
      </Box>
    </Stack>
  );
};
