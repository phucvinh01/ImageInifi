'use client';
import { useState, useTransition } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { aspectRatioOptions, defaultValues, transformationTypes } from '@/constants';
import { CustomField } from './CustomField';
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils';
import MediaUploader from './MediaUploader';
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

const TransformationForm = ({
  action,
  data = null,
  userId,
  creditBalance,
  type,
  config = null,
}: TransformationFormProps) => {
  const [isPending, startTransition] = useTransition()
  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTransformation, setNewTranformation] =
    useState<Transformations | null>();
      const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config)
  const initialValues =
    data && action === 'Update'
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const onTransformHandler = async () => {
    setIsTransforming(true)

    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    )

    setNewTranformation(null)

    startTransition(async () => {
      // await updateCredits(userId, creditFee)
    })
  }

  const onSelectFieldHandler = (value:string, onChangeField: (value:string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];
    setImage((preImage: any) => ({
      ...preImage,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height
    }))

    setNewTranformation(transformationType.config)

    return onChangeField(value)
  }

  const onInputHandleChangeValues = (fieldName:string, value:string, type:string, onChangeField: (value:string) => void) => {
      debounce(() => {
      setNewTranformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === 'prompt' ? 'prompt' : 'to' ]: value 
        }
      }))
    }, 1000)();
      
    return onChangeField(value)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'>
        <CustomField
          control={form.control}
          name='title'
          formLabel='Image Title'
          render={({ field }) => (
            <Input
              {...field}
              className='input-field'
            />
          )}
          className='w-full'
        />
        {type === 'fill' && (
          <CustomField
            control={form.control}
            name='aspectRatio'
            formLabel='Aspect Ratio'
            render={({ field }) => (
              <Select
                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            className='w-full'
          />
        )}

        {
          (type === 'remove' || type ==='recolor') && 
          <div>
             <CustomField
              control={form.control}
              name={'prompt'}
              formLabel={type === 'remove' ? 'Object to remove' : 'Object to recolor'}
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={(e) => onInputHandleChangeValues('prompt', e.target.value, type,field.onChange)}
                  {...field}
                  className='input-field'
                />
          )}
          className='w-full'
        />
          </div> 
        }
        {
          type === 'recolor' 
          && 
           <div>
             <CustomField
              control={form.control}
              name={'color'}
              formLabel={"Recolor Object"}
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={(e) => onInputHandleChangeValues('prompt', e.target.value, type,field.onChange)}
                  {...field}
                  className='input-field'
                />
          )}
          className='w-full'
        />
          </div> 
        }
        <div className='media-uploader-field'>
          <CustomField
            control={form.control}
            name='publicId'
            render={({ field }) => (
                <MediaUploader  
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}/>
          )}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Button 
            type="button"
            className="submit-button capitalize"
            disabled={isTransforming || newTransformation === null}
             onClick={onTransformHandler}
          >
            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
          </Button>
          <Button 
            type="submit"
            className="submit-button capitalize"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Save Image'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
